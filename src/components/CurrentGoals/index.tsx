import React from 'react';

const CurrentGoals: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto mb-8 grid gap-4 grid-cols-12 bg-white p-6">
      <div className=" p-6 bg-card col-span-12 md:col-span-8">
        <h3 className="text-2xl font-semibold mb-2">
          Open to full-time roles, project-based contracts, and mission-driven collaborations.
        </h3>
        <p className="text-muted-foreground mb-4">
          I\u2019m currently focused on building products that bring new capability to ambitious
          people. Open to senior engineering roles, contract work, and collaborative projects.
        </p>
      </div>

      <div className="col-span-12 md:col-span-4">
        <div className="rounded-lg border p-6 bg-card">
          <h4 className="text-lg font-semibold mb-3">Let\u2019s Discuss:</h4>
          <div>
            {[
              { label: 'Role Opportunities', variant: 'primary' },
              { label: 'Contract Opportunities', variant: 'secondary' },
              { label: 'Product Idea', variant: 'secondary' },
              { label: 'Whatever you\u2019d like!', variant: 'tertiary' },
            ].map((item) => (
              <div
                key={item.label}
                className={`mb-4 p-2 sm:p-3 px-4 rounded group transition-transform duration-150 ease-out md:hover:-translate-y-1 ${
                  item.variant === 'primary'
                    ? 'bg-gray-200'
                    : item.variant === 'secondary'
                    ? 'bg-gray-100'
                    : 'bg-transparent border border-gray-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    const w =
                      typeof window !== 'undefined'
                        ? (window as unknown as {
                            openContactModalWithTopic?: (topic?: string) => void;
                          })
                        : undefined;
                    const fn = w?.openContactModalWithTopic;
                    // map human-friendly labels to the contact modal's subtitle options
                    const map: Record<string, string> = {
                      'Role Opportunities': 'Role Opportunity',
                      'Contract Opportunities': 'Contracting Opportunity',
                      'Product Idea': 'Project Idea',
                      'Whatever you\u2019d like!': 'General Inquiry',
                    };
                    const topic = map[item.label] ?? item.label;
                    if (typeof fn === 'function') fn(topic);
                    else window.location.href = `/contact?topic=${encodeURIComponent(topic)}`;
                  }}
                  className="flex items-center gap-1 text-md md:text-base font-bold w-full text-left"
                >
                  <span className="transition-colors">{item.label}</span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-1 ml-1">
                    →
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentGoals;
