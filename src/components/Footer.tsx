export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 mt-auto z-10 shrink-0">
      <div className="container mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-slate-500 text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} EnterpriseGrid. Released under the MIT License.
        </div>
      </div>
    </footer>
  );
}
