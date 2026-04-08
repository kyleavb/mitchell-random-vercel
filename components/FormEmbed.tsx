interface FormEmbedProps {
  src?: string;
  title: string;
  subheading: string;
}

export default function FormEmbed({ src, title, subheading }: FormEmbedProps) {
  return (
    <div
      className="bg-silvergrass/70 backdrop-blur-xl rounded-xl shadow-elevated overflow-hidden border border-white/20"
      id="inquiry-form"
    >
      {/* Mitchell Red top accent — brand §4.4 line work */}
      <div className="h-1 bg-gradient-to-r from-secondary to-secondary-dark" />

      <div className="p-10 max-md:p-6">
        <h2 className="font-headline text-2xl font-bold text-primary mb-3">
          {title}
        </h2>
        {subheading && (
          <p className="text-on-surface-variant text-[0.9375rem] mb-8 max-w-none leading-relaxed">
            {subheading}
          </p>
        )}

        <div className="pardot-form" style={{ minHeight: "820px" }}>
          {src ? (
            <iframe
              src={src}
              title="Request Information Form"
              className="w-full border-none"
              style={{ colorScheme: "light", height: "820px" }}
              loading="lazy"
              sandbox="allow-same-origin allow-forms allow-popups allow-scripts"
            />
          ) : (
            <div className="w-full min-h-[320px] border-2 border-dashed border-outline-variant rounded-md flex items-center justify-center text-on-surface-variant text-sm text-center p-8">
              Pardot form will be embedded here.
              <br />
              Replace this placeholder with the iframe URL.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
