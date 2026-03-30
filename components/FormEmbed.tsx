interface FormEmbedProps {
  src?: string;
  title: string;
  subheading: string;
}

export default function FormEmbed({ src, title, subheading }: FormEmbedProps) {
  return (
    <div
      className="bg-white/5 backdrop-blur-xl p-10 rounded-xl"
      id="inquiry-form"
    >
      <h2 className="font-headline text-2xl font-bold text-on-primary mb-4">
        {title}
      </h2>
      <p className="text-on-primary-container text-[0.9375rem] mb-8 max-w-none leading-relaxed">
        {subheading}
      </p>

      <div className="min-h-[320px] flex items-center justify-center">
        {src ? (
          <iframe
            src={src}
            title="Request Information Form"
            className="w-full min-h-[320px] border-none rounded-md"
          />
        ) : (
          <div className="w-full min-h-[320px] border-2 border-dashed border-white/15 rounded-md flex items-center justify-center text-on-primary-container text-sm text-center p-8">
            Pardot form will be embedded here.
            <br />
            Replace this placeholder with the iframe URL.
          </div>
        )}
      </div>
    </div>
  );
}
