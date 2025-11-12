import os
import requests
from llama_index.readers.file import PDFReader
from llama_index.core import VectorStoreIndex
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

def download_pdfs():
    urls = [
        "https://static.tlscontact.com/media/ma/cas/be/2019_08_liste_harmonisee_documents_a_soumettre_pour_un_visa_de_court_sejour.pdf",
        "https://ma.consulfrance.org/IMG/pdf/pieces_a_fournir_etudiants_majeur.pdf?2453/cc842d3a1bfe1380d73c6608ca350250691199fd",
    ]
    save_dir = "pdf_visa_docs"
    os.makedirs(save_dir, exist_ok=True)

    paths = []
    for i, url in enumerate(urls):
        r = requests.get(url)
        path = os.path.join(save_dir, f"visa_doc_{i+1}.pdf")
        with open(path, "wb") as f:
            f.write(r.content)
        paths.append(path)
    return paths

if __name__ == "__main__":
    from llama_index.core import StorageContext, load_index_from_storage, Document
    paths = download_pdfs()

    docs = []
    loader = PDFReader()
    for path in paths:
        docs.extend(loader.load_data(file=path))

    embed_model = HuggingFaceEmbedding(model_name="all-MiniLM-L6-v2")
    index = VectorStoreIndex.from_documents(docs, embed_model=embed_model)

    # Sauvegarde l’index
    index.storage_context.persist("visa_index")
    print(" Index sauvegardé dans le dossier 'visa_index'")
