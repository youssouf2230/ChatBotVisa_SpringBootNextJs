import sys
import json
import re
from llama_index.core import StorageContext, load_index_from_storage
from llama_index.llms.mistralai import MistralAI
from llama_index.core.memory import ChatMemoryBuffer
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

MISTRAL_KEY = "rzdEu6fhvdl6jJCyONlHEqmivD8cRZcs"

def clean_response(result):
    """Nettoie la réponse brute du modèle pour ne garder que le texte humain lisible."""
    text = str(result)
    text = re.sub(r"^Bonjour[ !\n]*", "", text, flags=re.IGNORECASE)
    text = text.strip()
    text = text.replace("**", "").replace("__", "")
    text = text.replace("\\n", "\n").replace("\\r", "")
    def decode_unicode(match):
        return chr(int(match.group(1), 16))
    text = re.sub(r"\\u([0-9a-fA-F]{4})", decode_unicode, text)
    return text.strip()

def ask_question(question: str):
    # Charger l’index existant avec embeddings HuggingFace
    storage_context = StorageContext.from_defaults(persist_dir="visa_index")
    index = load_index_from_storage(storage_context)  # pas besoin de passer embed_model ici

    # Créer le moteur de requête
    memory = ChatMemoryBuffer.from_defaults(token_limit=1000)
    llm = MistralAI(api_key=MISTRAL_KEY, temperature=0.7)
    query_engine = index.as_query_engine(llm=llm, memory=memory)

    # Poser la question et nettoyer la réponse
    result = query_engine.query(question)
    cleaned_answer = clean_response(result)
    return cleaned_answer

def main():
    # Lire la question depuis stdin envoyée par Spring Boot
    input_data = sys.stdin.read()
    try:
        parsed = json.loads(input_data)
        question = parsed.get("question", "")
    except json.JSONDecodeError:
        question = str(input_data).strip()

    answer = ask_question(question)

    # Retourner la réponse en JSON
    print(json.dumps({"answer": answer}))

if __name__ == "__main__":
    main()
