def stress_index(hrv, amp):
    return round(hrv / (amp + 1e-6), 3)

def explain_factors(hrv, amp):
    factors = []
    if hrv > 0.1:
        factors.append("Elevated heart rate variability")
    if amp < 0.4:
        factors.append("Reduced perfusion amplitude")
    return factors

def precautions(risk, trend):
    tips = ["Maintain hydration", "Regular physical activity"]
    if risk != "Normal":
        tips.append("Monitor cardiovascular indicators regularly")
    if trend == "Increasing":
        tips.append("Consider medical screening if persists")
    return tips
