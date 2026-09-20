export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 text-sm text-muted-foreground md:grid-cols-3">
          <div>
            <h3 className="mb-4 font-semibold uppercase text-foreground">Customer Service</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">Help Centre</a></li>
              <li><a href="#" className="hover:text-primary">Payment Methods</a></li>
              <li><a href="#" className="hover:text-primary">Order Tracking</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold uppercase text-foreground">About Shoppe</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">About Us</a></li>
              <li><a href="#" className="hover:text-primary">Shoppe Policies</a></li>
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold uppercase text-foreground">Payment</h3>
            <div className="flex gap-2">
              <div className="flex h-8 w-12 items-center justify-center rounded border border-border bg-muted text-xs">COD</div>
              <div className="flex h-8 w-12 items-center justify-center rounded border border-border bg-muted text-xs">Card</div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Shoppe. All Rights Reserved. Built for learning.
        </div>
      </div>
    </footer>
  );
}