import cv2
import numpy as np
from scipy.signal import find_peaks
from scipy.fft import rfft, rfftfreq

FS = 30

def extract_vppg(video_path):
    cap = cv2.VideoCapture(video_path)
    signal = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        signal.append(frame[:, :, 1].mean())

    cap.release()
    signal = np.array(signal)

    return (signal - signal.mean()) / (signal.std() + 1e-6)

def scan_quality(signal):
    if len(signal) < FS * 5:
        return "Poor"
    if np.std(signal) < 0.05:
        return "Poor"
    return "Good"

def extract_features(signal):
    peaks, _ = find_peaks(signal, distance=FS*0.4)

    if len(peaks) < 2:
        return 0, 0, 0, 0, 0

    ibi = np.diff(peaks) / FS
    hr = 60 / np.mean(ibi)
    hrv = np.std(ibi)
    amp = np.mean(signal[peaks])
    var = np.var(signal)

    yf = np.abs(rfft(signal))
    xf = rfftfreq(len(signal), 1/FS)
    freq = xf[np.argmax(yf)]

    return hr, hrv, amp, var, freq
