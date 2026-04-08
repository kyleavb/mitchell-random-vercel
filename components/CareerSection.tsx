import Container from "./ui/Container";
import Kicker from "./ui/Kicker";
import Button from "./ui/Button";
import { CareerSectionData } from "@/lib/types";
import { ArrowForwardIcon } from "./icons";

function RoleList({ roles }: { roles: string[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 list-none m-0 p-0 max-md:grid-cols-1">
      {roles.map((role, i) => (
        <li
          key={i}
          className="flex items-center gap-3 py-3 px-4 bg-white/5 rounded-md text-on-primary text-[0.9375rem] font-medium transition-colors hover:bg-white/[0.08]"
        >
          <ArrowForwardIcon className="w-[1.125rem] h-[1.125rem] text-accent shrink-0" />
          {role}
        </li>
      ))}
    </ul>
  );
}

export default function CareerSection({
  kicker,
  heading,
  body,
  roles,
  roleGroups,
  aside,
  closingBody,
  ctaText,
  ctaHref,
}: Omit<CareerSectionData, "type">) {
  return (
    <section className="bg-primary-light py-32 max-md:py-16">
      <Container>
        <div className="grid grid-cols-[1.2fr_0.8fr] gap-16 items-center max-lg:grid-cols-1 max-lg:gap-12">
          <div className="flex flex-col gap-6">
            <Kicker>{kicker}</Kicker>
            <h2 className="text-on-primary">{heading}</h2>
            <p className="text-on-primary-container leading-[1.7] max-w-none">
              {body}
            </p>

            {roleGroups ? (
              roleGroups.map((group, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <p className="text-on-primary-container leading-[1.7] max-w-none font-medium">
                    {group.label}
                  </p>
                  <RoleList roles={group.roles} />
                </div>
              ))
            ) : roles ? (
              <RoleList roles={roles} />
            ) : null}

            {closingBody && (
              <p className="text-on-primary-container leading-[1.7] max-w-none">
                {closingBody}
              </p>
            )}
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-12 rounded-xl flex flex-col gap-6">
            <h3 className="text-on-primary">{aside.heading}</h3>
            <p className="text-on-primary-container leading-[1.7] max-w-none">
              {aside.body}
            </p>
            {ctaText && ctaHref && (
              <Button href={ctaHref}>{ctaText}</Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
