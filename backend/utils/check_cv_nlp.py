# backend/utils/check_cv_nlp.py
import sys
import os
import json
from sentence_transformers import SentenceTransformer, util
from docx import Document
from PyPDF2 import PdfReader
import re

# --- Fonctions pour lire les CV ---
def read_pdf(path):
    reader = PdfReader(path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

def read_docx(path):
    doc = Document(path)
    return "\n".join(p.text for p in doc.paragraphs)

def read_cv(cv_path):
    ext = os.path.splitext(cv_path)[1].lower()
    if ext == ".pdf":
        return read_pdf(cv_path)
    elif ext == ".docx":
        return read_docx(cv_path)
    else:
        raise ValueError("Format de CV non supporté (pdf ou docx uniquement)")

# --- Vérification des compétences ---
def check_cv(cv_path, skills, specialite_offre=None, threshold=0.6):
    text = read_cv(cv_path).lower()
    model = SentenceTransformer("all-MiniLM-L6-v2")

    # 🔹 1. Vérification des compétences
    cv_embedding = model.encode(text, convert_to_tensor=True)
    skill_embeddings = model.encode(skills, convert_to_tensor=True)
    similarities = util.cos_sim(cv_embedding, skill_embeddings)[0]

    found_skills = [skills[i] for i, score in enumerate(similarities) if score >= threshold]
    valid_skills = len(found_skills) >= max(1, len(skills)//2)  # ≥ 50% des compétences trouvées

    # 🔹 2. Vérification de compatibilité métier
    valid_specialite = True
    if specialite_offre:
        # On cherche si le CV contient la spécialité demandée (ex: "développeur", "designer")
        offer_terms = re.findall(r"\b[\w']+\b", specialite_offre.lower())
        found = any(term in text for term in offer_terms)
        valid_specialite = found

    # 🔹 3. Résultat global
    valid = valid_skills and valid_specialite
    return valid, found_skills, valid_specialite

# --- Exécution en ligne de commande ---
if __name__ == "__main__":
    if len(sys.argv) < 4:
        print(json.dumps({"error": "Usage: python check_cv_nlp.py <cv_path> <specialite_offre> <skill1> <skill2> ..."}))
        sys.exit(1)

    cv_file = sys.argv[1]
    specialite_offre = sys.argv[2]
    skills = sys.argv[3:]

    try:
        valid, found, valid_specialite = check_cv(cv_file, skills, specialite_offre)
        output = {
            "valid": valid,
            "valid_specialite": valid_specialite,
            "found_skills": found
        }
        print(json.dumps(output))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
