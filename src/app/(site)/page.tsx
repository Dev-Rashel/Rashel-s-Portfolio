import { getPublicHomeData } from "@/lib/data";
import { Hero } from "@/components/site/hero";
import { Ticker } from "@/components/site/ticker";
import { About } from "@/components/site/about";
import { Skills } from "@/components/site/skills";
import { Projects } from "@/components/site/projects";
import { Experience } from "@/components/site/experience";
import { Activities } from "@/components/site/activities";
import { Blog } from "@/components/site/blog";
import { Contact } from "@/components/site/contact";
import type { SectionOrder } from "@/lib/models/SiteSettings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getPublicHomeData();
  const { profile, settings } = data;
  const order = settings.sectionOrder.filter((key) => settings.sectionVisibility[key]);
  const firstSection = order[0] || "contact";

  const tickerItems = [
    profile.designation,
    ...Array.from(new Set(data.skills.map((skill) => skill.category))),
    profile.available ? "Available for new work" : profile.availability,
    ...profile.interests.slice(0, 2),
  ];

  const sections: Record<SectionOrder, React.ReactNode> = {
    about: <About profile={profile} copy={settings.sectionCopy.about} />,
    skills: <Skills skills={data.skills} copy={settings.sectionCopy.skills} />,
    projects: <Projects projects={data.projects} copy={settings.sectionCopy.projects} />,
    experience: (
      <Experience
        experiences={data.experiences}
        education={data.education}
        certifications={data.certifications}
        copy={settings.sectionCopy.experience}
      />
    ),
    activities: (
      <Activities
        activities={data.activities}
        achievements={data.achievements}
        copy={settings.sectionCopy.activities}
      />
    ),
    blog: <Blog posts={data.posts} copy={settings.sectionCopy.blog} />,
    contact: (
      <Contact
        copy={settings.sectionCopy.contact}
        contact={settings.contact}
        socials={profile.socials}
        available={profile.available}
        availability={profile.availability}
      />
    ),
  };

  return (
    <>
      <Hero profile={profile} scrollTarget={firstSection} />
      <Ticker items={tickerItems} />
      {order.map((key) => (
        <div key={key}>{sections[key]}</div>
      ))}
    </>
  );
}
