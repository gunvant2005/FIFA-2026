# =============================================
# AURA – RTSP Crowd Sensing Detection Feed
# =============================================

def process_stream(rtsp_url: str):
    """
    Simulates OpenCV frame loading and YOLOv8 inference to calculate zone density.
    """
    print(f"Connecting to RTSP feed: {rtsp_url}...")
    # In practice:
    # cap = cv2.VideoCapture(rtsp_url)
    # results = model(frame)
    # count_in_roi(results)
    return {"zone": "Zone G", "people_count": 520, "density_pct": 93}
