import { Globe, Mail, Server, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LEGAL_CONFIG } from "@/lib/constants/legal";
import { LegalSection, LegalSubsection } from "./LegalSection";
import { LegalTable } from "./LegalTable";

export function PrivacyPolicy() {
	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<Shield className="h-8 w-8 text-primary" />
					<h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
				</div>
				<div className="flex items-center gap-3 text-sm text-muted-foreground">
					<Badge variant="secondary">
						Last Updated: {LEGAL_CONFIG.lastUpdated}
					</Badge>
				</div>
			</div>

			<Separator />

			{/* Introduction */}
			<LegalSection id="introduction" title="Introduction">
				<p>
					Welcome to <strong>{LEGAL_CONFIG.websiteName}</strong>{" "}
					(&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed
					to protecting your privacy and ensuring transparency about how we
					collect, use, and safeguard your personal information.
				</p>
				<p>
					This Privacy Policy explains our practices regarding data collection
					when you use our website located at{" "}
					<strong>{LEGAL_CONFIG.websiteUrl}</strong> (the &quot;Service&quot;),
					a platform for discovering and listing Hytale game servers.
				</p>
				<Alert>
					<AlertDescription>
						By using our Service, you agree to the collection and use of
						information in accordance with this policy.
					</AlertDescription>
				</Alert>
			</LegalSection>

			{/* Information We Collect */}
			<LegalSection id="information-collected" title="Information We Collect">
				<LegalSubsection title="Information You Provide Directly">
					<p>
						When you register, submit a server, or interact with our Service, we
						may collect:
					</p>
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>
							<strong>Account Information</strong>: Username, email address, and
							password (encrypted)
						</li>
						<li>
							<strong>Profile Information</strong>: Avatar image, bio, and
							display preferences
						</li>
						<li>
							<strong>Server Information</strong>: Server name, IP address,
							description, images, and related details
						</li>
						<li>
							<strong>Payment Information</strong>: Billing address and payment
							details (processed securely by third-party providers)
						</li>
						<li>
							<strong>Communications</strong>: Messages you send to us, support
							requests, and feedback
						</li>
						<li>
							<strong>User Content</strong>: Reviews, comments, and ratings you
							post on the platform
						</li>
					</ul>
				</LegalSubsection>

				<LegalSubsection title="Information Collected Automatically">
					<p>When you access our Service, we automatically collect:</p>
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>
							<strong>Device Information</strong>: Browser type, operating
							system, device identifiers
						</li>
						<li>
							<strong>Log Data</strong>: IP address, access times, pages viewed,
							referring URLs
						</li>
						<li>
							<strong>Usage Data</strong>: Features used, servers viewed, votes
							cast, search queries
						</li>
						<li>
							<strong>Cookies and Tracking Technologies</strong>: See
							&quot;Cookies&quot; section below
						</li>
					</ul>
				</LegalSubsection>

				<LegalSubsection title="Information from Third Parties">
					<p>
						If you choose to link your account with third-party services, we may
						receive:
					</p>
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>
							<strong>Discord</strong>: Discord user ID, username, avatar, and
							email (if permitted)
						</li>
						<li>
							<strong>Google</strong>: Google account ID, name, email, and
							profile picture
						</li>
					</ul>
				</LegalSubsection>
			</LegalSection>

			{/* How We Use Your Information */}
			<LegalSection id="information-use" title="How We Use Your Information">
				<p>We use the collected information for the following purposes:</p>
				<ul className="list-disc list-inside space-y-2 ml-4">
					<li>
						<strong>Provide and Maintain the Service</strong>: Create accounts,
						display server listings, process votes, and enable core
						functionality
					</li>
					<li>
						<strong>Process Transactions</strong>: Handle sponsorship purchases,
						send invoices, and manage billing
					</li>
					<li>
						<strong>Improve Our Service</strong>: Analyze usage patterns, fix
						bugs, and develop new features
					</li>
					<li>
						<strong>Communicate With You</strong>: Send account notifications,
						security alerts, promotional content (with consent), and respond to
						inquiries
					</li>
					<li>
						<strong>Ensure Security</strong>: Detect fraud, prevent abuse,
						enforce voting limits, and protect against malicious activity
					</li>
					<li>
						<strong>Legal Compliance</strong>: Comply with applicable laws and
						respond to legal requests
					</li>
				</ul>
			</LegalSection>

			{/* How We Share Your Information */}
			<LegalSection
				id="information-sharing"
				title="How We Share Your Information"
			>
				<Alert className="mb-4">
					<AlertDescription>
						<strong>We do not sell your personal information.</strong>
					</AlertDescription>
				</Alert>

				<p>We may share your data in the following circumstances:</p>

				<LegalSubsection title="Publicly Visible Information">
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>
							Your username, avatar, and public profile are visible to all users
						</li>
						<li>
							Server listings you submit (if approved) are publicly displayed
						</li>
						<li>Reviews and comments you post are publicly visible</li>
					</ul>
				</LegalSubsection>

				<LegalSubsection title="Service Providers">
					<p className="mb-3">
						We share data with trusted third parties who assist in operating our
						Service:
					</p>
					<LegalTable
						columns={[
							{ key: "provider", header: "Provider" },
							{ key: "purpose", header: "Purpose" },
							{ key: "data", header: "Data Shared" },
						]}
						data={[
							{
								provider: "Stripe",
								purpose: "Payment processing",
								data: "Billing info, transaction details",
							},
							{
								provider: "PayPal",
								purpose: "Payment processing",
								data: "Billing info, transaction details",
							},
							{
								provider: "Vercel",
								purpose: "Hosting",
								data: "Log data, IP addresses",
							},
							{
								provider: "Discord",
								purpose: "Authentication",
								data: "OAuth tokens",
							},
							{
								provider: "Google Analytics",
								purpose: "Analytics",
								data: "Usage data (anonymized)",
							},
							{
								provider: "Cloudflare",
								purpose: "CDN & Security",
								data: "IP addresses, traffic data",
							},
						]}
					/>
				</LegalSubsection>

				<LegalSubsection title="Legal Requirements">
					<p>
						We may disclose information if required by law, legal process, or
						government request, or to protect our rights, safety, or property.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Business Transfers">
					<p>
						In the event of a merger, acquisition, or sale of assets, your
						information may be transferred to the acquiring entity.
					</p>
				</LegalSubsection>
			</LegalSection>

			{/* Cookies */}
			<LegalSection id="cookies" title="Cookies and Tracking Technologies">
				<LegalSubsection title="What Are Cookies?">
					<p>
						Cookies are small text files stored on your device that help us
						provide and improve our Service.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Types of Cookies We Use">
					<LegalTable
						columns={[
							{ key: "type", header: "Cookie Type" },
							{ key: "purpose", header: "Purpose" },
							{ key: "duration", header: "Duration" },
						]}
						data={[
							{
								type: "Essential",
								purpose: "Authentication, security, basic functionality",
								duration: "Session",
							},
							{
								type: "Functional",
								purpose: "Remember preferences, language settings",
								duration: "1 year",
							},
							{
								type: "Analytics",
								purpose: "Understand usage patterns, improve Service",
								duration: "2 years",
							},
							{
								type: "Marketing",
								purpose: "Deliver relevant advertisements (if applicable)",
								duration: "90 days",
							},
						]}
					/>
				</LegalSubsection>

				<LegalSubsection title="Managing Cookies">
					<p>
						You can control cookies through your browser settings. Note that
						disabling essential cookies may prevent you from using certain
						features of our Service.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Do Not Track">
					<p>
						Our Service does not currently respond to &quot;Do Not Track&quot;
						browser signals.
					</p>
				</LegalSubsection>
			</LegalSection>

			{/* Data Retention */}
			<LegalSection id="data-retention" title="Data Retention">
				<p>
					We retain your information for as long as necessary to provide our
					Service and fulfill the purposes outlined in this policy:
				</p>
				<ul className="list-disc list-inside space-y-1 ml-4">
					<li>
						<strong>Account Data</strong>: Retained until you delete your
						account
					</li>
					<li>
						<strong>Server Listings</strong>: Retained until removed by owner or
						deleted for policy violations
					</li>
					<li>
						<strong>Voting Records</strong>: Retained for 12 months for
						anti-fraud purposes
					</li>
					<li>
						<strong>Payment Records</strong>: Retained for 7 years for legal and
						tax compliance
					</li>
					<li>
						<strong>Log Data</strong>: Retained for 90 days
					</li>
				</ul>
				<p>
					Upon account deletion, we will remove or anonymize your personal data
					within 30 days, except where retention is required by law.
				</p>
			</LegalSection>

			{/* Data Security */}
			<LegalSection id="data-security" title="Data Security">
				<p>
					We implement industry-standard security measures to protect your
					information:
				</p>
				<ul className="list-disc list-inside space-y-1 ml-4">
					<li>Encryption of data in transit (HTTPS/TLS)</li>
					<li>Encryption of sensitive data at rest</li>
					<li>Secure password hashing (bcrypt)</li>
					<li>Regular security audits and vulnerability assessments</li>
					<li>Access controls and employee training</li>
				</ul>
				<Alert variant="destructive" className="mt-4">
					<AlertDescription>
						However, no method of transmission over the Internet is 100% secure.
						We cannot guarantee absolute security.
					</AlertDescription>
				</Alert>
			</LegalSection>

			{/* Your Rights */}
			<LegalSection id="your-rights" title="Your Rights and Choices">
				<p>Depending on your location, you may have the following rights:</p>

				<LegalSubsection title="For All Users">
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>
							<strong>Access</strong>: Request a copy of your personal data
						</li>
						<li>
							<strong>Correction</strong>: Update or correct inaccurate
							information
						</li>
						<li>
							<strong>Deletion</strong>: Request deletion of your account and
							data
						</li>
						<li>
							<strong>Opt-Out</strong>: Unsubscribe from marketing
							communications
						</li>
					</ul>
				</LegalSubsection>

				<LegalSubsection title="For EU/EEA Residents (GDPR)">
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>Right to data portability</li>
						<li>Right to restrict processing</li>
						<li>Right to object to processing</li>
						<li>Right to withdraw consent</li>
						<li>Right to lodge a complaint with a supervisory authority</li>
					</ul>
				</LegalSubsection>

				<LegalSubsection title="For Brazilian Residents (LGPD)">
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>Right to confirmation of data processing</li>
						<li>Right to access your data</li>
						<li>Right to correct incomplete or inaccurate data</li>
						<li>Right to anonymization, blocking, or deletion</li>
						<li>Right to data portability</li>
						<li>
							Right to information about third parties with whom data is shared
						</li>
						<li>Right to revoke consent</li>
					</ul>
				</LegalSubsection>

				<LegalSubsection title="For California Residents (CCPA)">
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>Right to know what personal information is collected</li>
						<li>Right to request deletion</li>
						<li>Right to opt-out of sale (we do not sell data)</li>
						<li>Right to non-discrimination</li>
					</ul>
				</LegalSubsection>

				<p className="mt-4">
					To exercise any of these rights, contact us at{" "}
					<a
						href={`mailto:${LEGAL_CONFIG.emails.privacy}`}
						className="text-primary hover:underline font-medium"
					>
						{LEGAL_CONFIG.emails.privacy}
					</a>
					.
				</p>
			</LegalSection>

			{/* Children's Privacy */}
			<LegalSection id="childrens-privacy" title="Children's Privacy">
				<p>
					Our Service is not directed to children under the age of{" "}
					{LEGAL_CONFIG.minimumAge} (or {LEGAL_CONFIG.minimumAgeEU} in the EU).
					We do not knowingly collect personal information from children. If you
					believe a child has provided us with personal data, please contact us,
					and we will delete such information.
				</p>
			</LegalSection>

			{/* International Transfers */}
			<LegalSection
				id="international-transfers"
				title="International Data Transfers"
			>
				<p>
					Your information may be transferred to and processed in countries
					other than your own. We ensure appropriate safeguards are in place,
					including standard contractual clauses where required.
				</p>
			</LegalSection>

			{/* Changes to Policy */}
			<LegalSection id="changes" title="Changes to This Policy">
				<p>
					We may update this Privacy Policy from time to time. We will notify
					you of significant changes by:
				</p>
				<ul className="list-disc list-inside space-y-1 ml-4">
					<li>Posting the new policy on this page</li>
					<li>Updating the &quot;Last Updated&quot; date</li>
					<li>Sending an email notification (for material changes)</li>
				</ul>
				<p>We encourage you to review this policy periodically.</p>
			</LegalSection>

			{/* Contact */}
			<LegalSection id="contact" title="Contact Us">
				<p>
					If you have questions or concerns about this Privacy Policy, please
					contact us:
				</p>
				<Card className="mt-4">
					<CardContent className="pt-6">
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<Mail className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Email</p>
									<a
										href={`mailto:${LEGAL_CONFIG.emails.privacy}`}
										className="text-primary hover:underline"
									>
										{LEGAL_CONFIG.emails.privacy}
									</a>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Globe className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Address</p>
									<p>{LEGAL_CONFIG.businessAddress}</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Server className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">
										Data Protection Officer
									</p>
									<a
										href={`mailto:${LEGAL_CONFIG.emails.dpo}`}
										className="text-primary hover:underline"
									>
										{LEGAL_CONFIG.emails.dpo}
									</a>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</LegalSection>
		</div>
	);
}

export const privacyTocItems = [
	{ id: "introduction", title: "Introduction" },
	{ id: "information-collected", title: "Information We Collect" },
	{ id: "information-use", title: "How We Use Information" },
	{ id: "information-sharing", title: "How We Share Information" },
	{ id: "cookies", title: "Cookies" },
	{ id: "data-retention", title: "Data Retention" },
	{ id: "data-security", title: "Data Security" },
	{ id: "your-rights", title: "Your Rights" },
	{ id: "childrens-privacy", title: "Children's Privacy" },
	{ id: "international-transfers", title: "International Transfers" },
	{ id: "changes", title: "Changes to Policy" },
	{ id: "contact", title: "Contact Us" },
];
