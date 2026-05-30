def generate_health_remarks(glucose: float, haemoglobin: float, cholesterol: float) -> str:
    """
    Generate basic health remarks based on blood test values.
    TODO: Integrate with actual ML model via API later
    """
    remarks = []
    
    # Glucose check
    if glucose > 140:
        remarks.append("High diabetes risk due to elevated glucose levels.")
    elif glucose < 70:
        remarks.append("Low glucose detected, monitor for hypoglycemia.")
        
    # Haemoglobin check
    if haemoglobin < 12.0:
        remarks.append("Possible anemia detected because of low haemoglobin.")
    elif haemoglobin > 17.5:
        remarks.append("Elevated haemoglobin levels.")
        
    # Cholesterol check
    if cholesterol > 200:
        remarks.append("High cholesterol may indicate cardiovascular risk.")
        
    if not remarks:
        return "Health indicators are within normal range."
        
    return " ".join(remarks)
