export function Dropzone({ onFile }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0];
    if (f) onFile(f);
  };
  return (
    <div
      onDragOver={(e)=>e.preventDefault()}
      onDrop={handleDrop}
      onClick={()=>{
        const inp = document.createElement('input');
        inp.type = 'file'; inp.accept='audio/*';
        inp.onchange = ()=>{ const f = inp.files?.[0]; if (f) onFile(f); };
        inp.click();
      }}
      role="button" aria-label="Upload audio"
      className="cursor-pointer rounded-2xl border-2 border-dashed border-border bg-white/80 p-10 text-center
                 transition hover:border-brand-500 hover:bg-white data-[active=true]:border-brand-600 data-[active=true]:bg-brand-600/5"
    >
      <p className="text-base font-semibold">Drag and drop your audio here</p>
      <p className="mt-1 text-sm text-muted">or click to choose a file</p>
      <p className="mt-3 text-xs text-muted">Supported: .wav .mp3 .m4a .aac .ogg .flac • up to 30 MB</p>
    </div>
  );
}
