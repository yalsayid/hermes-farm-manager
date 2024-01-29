import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout')({
  component: () => (
    <div className="h-screen w-screen grid grid-cols-[200px,1fr]">
      <aside className="bg-gray-100/50">
        <div
          className="w-full h-8 bg-violet-500/80"
          style={{ WebkitAppRegion: 'drag' } as any}
        />
      </aside>
      <div className={`bg-background`}>
        <Outlet />
      </div>
    </div>
  ),
});
