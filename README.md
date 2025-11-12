#  Chatbot Visa — Assistant Intelligent Multilingue
<img width="1920" height="961" alt="image" src="https://github.com/user-attachments/assets/88f5105a-f650-4bb5-b78a-e5e3ec8759fd" />
<img width="1906" height="893" alt="image" src="https://github.com/user-attachments/assets/5791e571-be47-44c6-b3e2-77fcd4b5e04d" />


## ----------------------------------------------------------------------------------------------------------------------------------


Un **chatbot intelligent** développé avec **Spring Boot**, **LLamaIndex**, et **Next.js**, capable de répondre aux questions relatives aux **procédures de visa** à partir de **documents officiels (PDF)**.  
Le projet combine les technologies d’**IA générative** et de **RAG (Retrieval-Augmented Generation)** pour offrir des réponses précises et contextuelles.

---

##  Objectif du projet

Le but est de permettre à un utilisateur de poser des questions naturelles (ex. *"Quels sont les documents nécessaires pour un visa étudiant ?"*) et d’obtenir une réponse claire, fondée sur les **textes officiels extraits et indexés** depuis des **documents PDF de visa**.

---


---

## ⚙️ Technologies principales

###  Backend — Spring Boot
- **Spring Boot 3+**
- **Spring Web / REST**
- **OpenAI API ou Ollama / LM Studio / Local LLM**
- **Integration Python (ProcessBuilder / REST Python Bridge)**
- **RAG Pipeline :**
  - Extraction et segmentation de textes
  - Indexation vectorielle
  - Récupération contextuelle
  - Génération de réponse via LLM

###  IA & Indexation — LLamaIndex / LangChain
- **LLamaIndex (Python)**
- **SentenceTransformers / OpenAI Embeddings**
- **FAISS ou ChromaDB** pour l’index vectoriel
- **RAG (Retrieval-Augmented Generation)**

###  Frontend — Next.js
- **Next.js 14+ (App Router)**
- **Tailwind CSS**
- **TypeScript**
- **Axios** pour communiquer avec le backend
- **shadcn/ui** pour un design professionnel et minimaliste

---

##  Fonctionnalités

### Chatbot intelligent
- Compréhension du langage naturel (français / anglais )
- Réponses contextuelles basées sur les documents PDF
- Historique de conversation (state local ou base de données)
- Interaction en temps réel via WebSocket ou REST

###  Traitement documentaire
- Lecture automatique de tous les fichiers PDF dans `pdf_visa_docs/`
- Extraction du texte, création d’embeddings et sauvegarde dans `visa_index/`
- Actualisation automatique de l’index si de nouveaux PDF sont ajoutés

###  RAG Workflow
1. L’utilisateur pose une question.
2. Le système recherche dans l’index vectoriel les passages les plus pertinents.
3. Le modèle LLM génère une réponse fondée sur ces passages.


