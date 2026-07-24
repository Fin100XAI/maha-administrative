"""The 33 Maharashtra departments and their 6 logical clusters.

This is the filter backbone (F1). `slug` is used as the Qdrant metadata value
and collection scoping key, so it must stay stable once data is ingested.
"""
import re

CLUSTERS = {
    "Social Welfare": [
        "Social Justice and Special Assistance",
        "Tribal Development",
        "Minorities Development",
        "Other Backward Bahujan Welfare",
        "Persons with Disabilities Welfare",
    ],
    "Land & Revenue": [
        "Revenue and Forest",
        "Urban Development",
        "Rural Development",
        "Housing",
        "Planning",
    ],
    "Infrastructure": [
        "Public Works",
        "Water Resources",
        "Water Supply and Sanitation",
        "Soil and Water Conservation",
    ],
    "Economic": [
        "Agriculture, Dairy Development, Animal Husbandry and Fisheries",
        "Industries, Energy and Labour",
        "Finance",
        "Co-operation, Textiles and Marketing",
        "Skill Development and Entrepreneurship",
        "Food, Civil Supplies and Consumer Protection",
        "Tourism and Cultural Affairs",
    ],
    "Health & Education": [
        "Public Health",
        "Medical Education and Drugs",
        "School Education and Sports",
        "Higher and Technical Education",
        "Women and Child Development",
        "Marathi Language",
        "Environment",
    ],
    "Governance": [
        "General Administration",
        "Law and Judiciary",
        "Home",
        "Parliamentary Affairs",
        "Information Technology",
    ],
}


def slugify(name: str) -> str:
    s = name.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


# Flat list of every department with its slug + cluster.
DEPARTMENTS = []
for cluster, names in CLUSTERS.items():
    for name in names:
        DEPARTMENTS.append({"name": name, "slug": slugify(name), "cluster": cluster})

DEPT_BY_SLUG = {d["slug"]: d for d in DEPARTMENTS}
VALID_SLUGS = set(DEPT_BY_SLUG.keys())


def resolve_slug(value: str) -> str | None:
    """Accept a slug or a full name and return the canonical slug."""
    if value in VALID_SLUGS:
        return value
    s = slugify(value)
    return s if s in VALID_SLUGS else None
