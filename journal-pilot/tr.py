from faster_whisper import WhisperModel
m=WhisperModel("base.en",device="cpu",compute_type="int8",cpu_threads=6)
segs,info=m.transcribe("mccaul.mp3",beam_size=1,vad_filter=True)
with open("mccaul-transcript.txt","w") as f:
    for s in segs:
        mm,ss=divmod(int(s.start),60)
        f.write(f"[{mm:02d}:{ss:02d}] {s.text.strip()}\n"); f.flush()
print("done")
