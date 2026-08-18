"use client";

export default function RoleCard({
  role,
  title,
  copy,
}: {
  role: string;
  title: string;
  copy: string;
}) {
  function apply() {
    window.dispatchEvent(new CustomEvent("growblic-role", { detail: role }));
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <div className="role-card">
      <h3>{title}</h3>
      <p>{copy}</p>
      <button type="button" className="btn btn-ghost" onClick={apply}>
        Apply
      </button>
    </div>
  );
}
