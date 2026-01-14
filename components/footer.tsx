import { Github, MessageCircle, Twitter } from "lucide-react";

export function Footer() {
	return (
		<footer className="border-t border-border bg-card">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid gap-8 md:grid-cols-4">
					<div className="md:col-span-2">
						<div className="flex items-center gap-2">
							<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
								<span className="text-lg font-bold text-primary-foreground">
									H
								</span>
							</div>
							<span className="text-xl font-bold text-foreground">Hytopia</span>
						</div>
						<p className="mt-4 max-w-md text-sm text-muted-foreground">
							The premier server hub for Hytale. Discover amazing servers,
							connect with players, and find your next adventure in the world of
							Hytale.
						</p>
						{/*<div className="mt-6 flex gap-4">
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
            </div>*/}
					</div>
				</div>

				{/*<div>
            <h3 className="font-semibold text-foreground">Platform</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                  Browse Servers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                  Submit Server
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                  Server Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                  API Access
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">Community</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                  Forums
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                  News & Updates
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>*/}

				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
					<p className="text-sm text-muted-foreground">
						© 2026 Hytopia. Not affiliated with Hypixel Studios.
					</p>
					<div className="flex gap-6">
						<a
							href="/privacy"
							className="text-sm text-muted-foreground hover:text-primary"
						>
							Privacy
						</a>
						<a
							href="/terms"
							className="text-sm text-muted-foreground hover:text-primary"
						>
							Terms
						</a>
						<a
							href="/support"
							className="text-sm text-muted-foreground hover:text-primary"
						>
							Contact
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
