export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground mb-4 uppercase">Customer Service</h3>
            <ul className="space-y-2">
              <li>Help Centre</li>
              <li>Payment Methods</li>
              <li>Order Tracking</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4 uppercase">About Shoppe</h3>
            <ul className="space-y-2">
              <li>About Us</li>
              <li>Shoppe Policies</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4 uppercase">Payment</h3>
            <div className="flex gap-2">
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs border border-border">COD</div>
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs border border-border">Card</div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Shoppe. All Rights Reserved. Built for learning.
        </div>
      </div>
    </footer>
  );
}