from faster_whisper import WhisperModel
m=WhisperModel("small.en",device="cpu",compute_type="int8",cpu_threads=6)
segs,_=m.transcribe("seg.wav",beam_size=5)
for s in segs:
    t=210+s.start; print(f"[{int(t//60):02d}:{int(t%60):02d}] {s.text.strip()}")
