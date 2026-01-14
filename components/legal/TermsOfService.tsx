import {
	AlertTriangle,
	CheckCircle2,
	FileText,
	Globe,
	Mail,
	XCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LEGAL_CONFIG } from "@/lib/constants/legal";
import { LegalSection, LegalSubsection } from "./LegalSection";
import { LegalTable } from "./LegalTable";

export function TermsOfService() {
	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<FileText className="h-8 w-8 text-primary" />
					<h1 className="text-4xl font-bold tracking-tight">
						Terms of Service
					</h1>
				</div>
				<div className="flex items-center gap-3 text-sm text-muted-foreground">
					<Badge variant="secondary">
						Last Updated: {LEGAL_CONFIG.lastUpdated}
					</Badge>
				</div>
			</div>

			<Separator />

			{/* Agreement to Terms */}
			<LegalSection id="agreement" title="Agreement to Terms">
				<p>
					Welcome to <strong>{LEGAL_CONFIG.websiteName}</strong>{" "}
					(&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or
					&quot;us&quot;). These Terms of Service (&quot;Terms&quot;) govern
					your access to and use of our website at{" "}
					<strong>{LEGAL_CONFIG.websiteUrl}</strong> (the &quot;Service&quot;),
					a platform for discovering and listing Hytale game servers.
				</p>
				<Alert>
					<AlertDescription>
						By accessing or using our Service, you agree to be bound by these
						Terms. If you do not agree, you may not use the Service.
					</AlertDescription>
				</Alert>
			</LegalSection>

			{/* Eligibility */}
			<LegalSection id="eligibility" title="Eligibility">
				<p>To use our Service, you must:</p>
				<ul className="list-disc list-inside space-y-1 ml-4">
					<li>
						Be at least {LEGAL_CONFIG.minimumAge} years old (or{" "}
						{LEGAL_CONFIG.minimumAgeEU} in the EU)
					</li>
					<li>Have the legal capacity to enter into a binding agreement</li>
					<li>
						Not be prohibited from using the Service under applicable laws
					</li>
					<li>Provide accurate and complete registration information</li>
				</ul>
				<p>
					If you are using the Service on behalf of an organization, you
					represent that you have authority to bind that organization to these
					Terms.
				</p>
			</LegalSection>

			{/* Account Registration */}
			<LegalSection id="accounts" title="Account Registration">
				<LegalSubsection title="Creating an Account">
					<p>
						To access certain features (voting, submitting servers, purchasing
						sponsorships), you must create an account. You agree to:
					</p>
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>Provide accurate, current, and complete information</li>
						<li>Maintain and update your information as needed</li>
						<li>Keep your password secure and confidential</li>
						<li>Notify us immediately of any unauthorized access</li>
					</ul>
				</LegalSubsection>

				<LegalSubsection title="Account Responsibility">
					<p>
						You are responsible for all activities that occur under your
						account. We are not liable for any loss or damage arising from
						unauthorized use of your account.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Account Termination">
					<p>
						We reserve the right to suspend or terminate your account at any
						time, with or without cause or notice, including for:
					</p>
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>Violation of these Terms</li>
						<li>Fraudulent or illegal activity</li>
						<li>Abusive behavior toward other users</li>
						<li>Extended period of inactivity (12+ months)</li>
					</ul>
				</LegalSubsection>
			</LegalSection>

			{/* Server Listings */}
			<LegalSection id="server-listings" title="Server Listings">
				<LegalSubsection title="Submitting a Server">
					<p>
						Server owners may submit their Hytale servers for listing on our
						platform. By submitting a server, you represent and warrant that:
					</p>
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>You own or have authorization to list the server</li>
						<li>The server information is accurate and not misleading</li>
						<li>The server complies with Hytale&apos;s terms of service</li>
						<li>The server does not host illegal content or activities</li>
					</ul>
				</LegalSubsection>

				<LegalSubsection title="Approval Process">
					<p>
						All server submissions are subject to review and approval at our
						sole discretion. We may reject or remove any server listing that:
					</p>
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>Contains false or misleading information</li>
						<li>Promotes illegal activities</li>
						<li>Violates intellectual property rights</li>
						<li>Contains inappropriate or offensive content</li>
						<li>Violates Hytale&apos;s terms of service</li>
					</ul>
				</LegalSubsection>

				<LegalSubsection title="Server Owner Responsibilities">
					<p>Server owners are responsible for:</p>
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>Maintaining accurate and up-to-date server information</li>
						<li>Ensuring their server complies with all applicable laws</li>
						<li>Responding to player feedback and concerns</li>
						<li>Not manipulating votes or reviews</li>
					</ul>
				</LegalSubsection>
			</LegalSection>

			{/* Voting System */}
			<LegalSection id="voting" title="Voting System">
				<LegalSubsection title="Voting Rules">
					<p>
						Our voting system allows players to support their favorite servers.
						By participating, you agree to:
					</p>
					<Card className="mt-3">
						<CardContent className="pt-6">
							<div className="grid gap-3">
								<div className="flex items-start gap-2">
									<CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
									<span>Vote only once per server per 24-hour period</span>
								</div>
								<div className="flex items-start gap-2">
									<XCircle className="h-5 w-5 text-red-500 mt-0.5" />
									<span>
										Not use bots, scripts, or automated tools to cast votes
									</span>
								</div>
								<div className="flex items-start gap-2">
									<XCircle className="h-5 w-5 text-red-500 mt-0.5" />
									<span>Not create multiple accounts to manipulate votes</span>
								</div>
								<div className="flex items-start gap-2">
									<XCircle className="h-5 w-5 text-red-500 mt-0.5" />
									<span>
										Not offer or accept real money in exchange for votes
									</span>
								</div>
								<div className="flex items-start gap-2">
									<XCircle className="h-5 w-5 text-red-500 mt-0.5" />
									<span>
										Not use VPNs or proxies to circumvent voting limits
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</LegalSubsection>

				<LegalSubsection title="Vote Manipulation">
					<Alert variant="destructive">
						<AlertTriangle className="h-4 w-4" />
						<AlertDescription>
							Vote manipulation is strictly prohibited and may result in:
							removal of fraudulent votes, suspension or termination of your
							account, removal of your server listing, and permanent ban from
							the platform.
						</AlertDescription>
					</Alert>
				</LegalSubsection>

				<LegalSubsection title="Vote Rewards">
					<p>
						Server owners may offer in-game rewards for voting. We are not
						responsible for the delivery or fulfillment of such rewards.
					</p>
				</LegalSubsection>
			</LegalSection>

			{/* Reviews */}
			<LegalSection id="reviews" title="Reviews and User Content">
				<LegalSubsection title="Posting Reviews">
					<p>
						Users may post reviews and ratings for servers they have played on.
						By posting content, you agree that:
					</p>
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>Your review reflects your genuine experience</li>
						<li>You will not post false, defamatory, or misleading content</li>
						<li>
							You will not harass, threaten, or abuse server owners or other
							users
						</li>
						<li>
							You will not post spam, advertisements, or promotional content
						</li>
					</ul>
				</LegalSubsection>

				<LegalSubsection title="Content Ownership">
					<p>
						You retain ownership of content you post. However, by posting
						content on our Service, you grant us a worldwide, non-exclusive,
						royalty-free license to use, display, reproduce, and distribute your
						content in connection with operating and promoting the Service.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Content Moderation">
					<p>
						We reserve the right to remove any content that violates these
						Terms, without prior notice. Server owners may respond to reviews
						but may not harass reviewers.
					</p>
				</LegalSubsection>
			</LegalSection>

			{/* Payments */}
			<LegalSection id="payments" title="Sponsorships and Payments">
				<LegalSubsection title="Purchasing Sponsorships">
					<p>
						Server owners may purchase sponsorships to promote their servers.
						All sponsorship packages are described on our website and are
						subject to availability.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Pricing and Payment">
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>
							All prices are displayed in USD (or local currency equivalent)
						</li>
						<li>Payment is processed securely through Stripe or PayPal</li>
						<li>
							You agree to pay all fees and charges at the prices in effect at
							the time of purchase
						</li>
						<li>All applicable taxes are your responsibility</li>
					</ul>
				</LegalSubsection>

				<LegalSubsection title="Refund Policy">
					<LegalTable
						columns={[
							{ key: "type", header: "Situation" },
							{ key: "policy", header: "Refund Policy" },
						]}
						data={[
							{
								type: "Unused Sponsorships",
								policy:
									"Full refund if requested within 24 hours and before period begins",
							},
							{
								type: "Active Sponsorships",
								policy: "Prorated refund at our discretion for unused time",
							},
							{
								type: "Completed Sponsorships",
								policy: "No refunds for fully used sponsorship periods",
							},
							{
								type: "Policy Violations",
								policy: "No refunds if terminated for violating Terms",
							},
						]}
					/>
				</LegalSubsection>

				<LegalSubsection title="Auto-Renewal">
					<p>
						Sponsorships do not auto-renew. You will receive email reminders
						before your sponsorship expires.
					</p>
				</LegalSubsection>
			</LegalSection>

			{/* Prohibited Conduct */}
			<LegalSection id="prohibited" title="Prohibited Conduct">
				<p>You agree not to:</p>
				<div className="grid md:grid-cols-2 gap-2 mt-3">
					{[
						"Use the Service for any illegal purpose",
						"Violate any applicable laws or regulations",
						"Impersonate any person or entity",
						"Interfere with or disrupt the Service",
						"Attempt unauthorized access to any part of the Service",
						"Use automated tools to scrape or collect data",
						"Upload malware, viruses, or malicious code",
						"Engage in activity that could damage the Service",
						"Harass, abuse, or harm other users",
						"Circumvent security measures or access controls",
						"Distribute spam or unsolicited communications",
						"Infringe on any intellectual property rights",
					].map((item, index) => (
						<div key={index} className="flex items-start gap-2">
							<XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
							<span className="text-sm">{item}</span>
						</div>
					))}
				</div>
			</LegalSection>

			{/* Intellectual Property */}
			<LegalSection id="ip" title="Intellectual Property">
				<LegalSubsection title="Our Intellectual Property">
					<p>
						The Service, including its design, features, content, and branding,
						is owned by us and protected by intellectual property laws. You may
						not copy, modify, distribute, or create derivative works without our
						written permission.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Hytale Trademark">
					<p>
						&quot;Hytale&quot; is a trademark of Hypixel Studios. We are not
						affiliated with, endorsed by, or officially connected to Hypixel
						Studios. Our use of the Hytale name is for descriptive purposes
						only.
					</p>
				</LegalSubsection>

				<LegalSubsection title="DMCA and Copyright">
					<p>
						If you believe content on our Service infringes your copyright,
						please contact us at{" "}
						<a
							href={`mailto:${LEGAL_CONFIG.emails.dmca}`}
							className="text-primary hover:underline"
						>
							{LEGAL_CONFIG.emails.dmca}
						</a>{" "}
						with:
					</p>
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>Your contact information</li>
						<li>Description of the copyrighted work</li>
						<li>Location of the infringing content</li>
						<li>A statement of good faith belief</li>
						<li>Your signature (electronic or physical)</li>
					</ul>
				</LegalSubsection>
			</LegalSection>

			{/* Third-Party Services */}
			<LegalSection id="third-party" title="Third-Party Services">
				<p>
					Our Service may contain links to or integrations with third-party
					websites and services (Discord, Stripe, PayPal, etc.). We are not
					responsible for:
				</p>
				<ul className="list-disc list-inside space-y-1 ml-4">
					<li>
						The content, privacy practices, or terms of third-party services
					</li>
					<li>Any transactions or interactions you have with third parties</li>
					<li>
						Any damages or losses arising from your use of third-party services
					</li>
				</ul>
			</LegalSection>

			{/* Disclaimers */}
			<LegalSection id="disclaimers" title="Disclaimers">
				<Card className="border-yellow-500/50 bg-yellow-500/10">
					<CardContent className="pt-6">
						<h3 className="font-semibold mb-2 flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-yellow-500" />
							Service Provided &quot;As Is&quot;
						</h3>
						<p className="text-sm text-muted-foreground uppercase">
							THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
							AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
							IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
							MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
							NON-INFRINGEMENT.
						</p>
					</CardContent>
				</Card>

				<LegalSubsection title="No Guarantee">
					<p>We do not guarantee that:</p>
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>The Service will be uninterrupted, secure, or error-free</li>
						<li>Server listings are accurate or reliable</li>
						<li>
							Servers listed are safe, legitimate, or of any particular quality
						</li>
						<li>Results obtained from using the Service will be accurate</li>
					</ul>
				</LegalSubsection>

				<LegalSubsection title="Server Responsibility">
					<p>
						We are a listing platform only. We do not operate, control, or
						endorse any servers listed on our Service. Server owners are solely
						responsible for their servers, including:
					</p>
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>Server content and gameplay</li>
						<li>Player data and privacy</li>
						<li>In-game purchases and transactions</li>
						<li>Compliance with Hytale&apos;s terms of service</li>
					</ul>
				</LegalSubsection>
			</LegalSection>

			{/* Limitation of Liability */}
			<LegalSection id="liability" title="Limitation of Liability">
				<Card className="border-red-500/50 bg-red-500/10">
					<CardContent className="pt-6">
						<p className="text-sm text-muted-foreground uppercase">
							TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE BE
							LIABLE FOR ANY: INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
							PUNITIVE DAMAGES; LOSS OF PROFITS, DATA, USE, OR GOODWILL; DAMAGES
							ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE; DAMAGES
							ARISING FROM ANY SERVERS LISTED ON THE SERVICE; DAMAGES EXCEEDING
							THE AMOUNT YOU PAID TO US IN THE PAST 12 MONTHS (OR $100 IF YOU
							HAVE NOT MADE ANY PAYMENTS).
						</p>
					</CardContent>
				</Card>
				<p className="text-sm text-muted-foreground mt-3">
					Some jurisdictions do not allow the exclusion of certain warranties or
					limitation of liability, so some of the above may not apply to you.
				</p>
			</LegalSection>

			{/* Indemnification */}
			<LegalSection id="indemnification" title="Indemnification">
				<p>
					You agree to indemnify, defend, and hold harmless the Company, its
					officers, directors, employees, and agents from any claims, damages,
					losses, liabilities, and expenses (including legal fees) arising from:
				</p>
				<ul className="list-disc list-inside space-y-1 ml-4">
					<li>Your use of the Service</li>
					<li>Your violation of these Terms</li>
					<li>Your violation of any third-party rights</li>
					<li>Content you submit to the Service</li>
					<li>Your server listing (if applicable)</li>
				</ul>
			</LegalSection>

			{/* Dispute Resolution */}
			<LegalSection id="disputes" title="Dispute Resolution">
				<LegalSubsection title="Informal Resolution">
					<p>
						Before filing any formal dispute, you agree to contact us at{" "}
						<a
							href={`mailto:${LEGAL_CONFIG.emails.legal}`}
							className="text-primary hover:underline"
						>
							{LEGAL_CONFIG.emails.legal}
						</a>{" "}
						to attempt to resolve the matter informally within 30 days.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Governing Law">
					<p>
						These Terms shall be governed by and construed in accordance with
						the laws of <strong>{LEGAL_CONFIG.jurisdiction}</strong>, without
						regard to its conflict of law provisions.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Jurisdiction">
					<p>
						Any legal action or proceeding arising out of these Terms shall be
						brought exclusively in the courts of{" "}
						<strong>{LEGAL_CONFIG.jurisdiction}</strong>, and you consent to the
						personal jurisdiction of such courts.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Class Action Waiver">
					<p>
						You agree that any disputes will be resolved on an individual basis
						and not as part of any class, consolidated, or representative
						action.
					</p>
				</LegalSubsection>
			</LegalSection>

			{/* Changes to Terms */}
			<LegalSection id="changes" title="Changes to Terms">
				<p>
					We may modify these Terms at any time. We will provide notice of
					material changes by:
				</p>
				<ul className="list-disc list-inside space-y-1 ml-4">
					<li>Posting the updated Terms on this page</li>
					<li>Updating the &quot;Last Updated&quot; date</li>
					<li>Sending an email notification for significant changes</li>
				</ul>
				<p>
					Your continued use of the Service after changes become effective
					constitutes acceptance of the revised Terms.
				</p>
			</LegalSection>

			{/* Severability */}
			<LegalSection id="severability" title="Severability">
				<p>
					If any provision of these Terms is found to be unenforceable or
					invalid, that provision shall be limited or eliminated to the minimum
					extent necessary, and the remaining provisions shall remain in full
					force and effect.
				</p>
			</LegalSection>

			{/* Entire Agreement */}
			<LegalSection id="entire-agreement" title="Entire Agreement">
				<p>
					These Terms, together with our Privacy Policy, constitute the entire
					agreement between you and the Company regarding the Service and
					supersede all prior agreements and understandings.
				</p>
			</LegalSection>

			{/* Contact */}
			<LegalSection id="contact" title="Contact Us">
				<p>If you have questions about these Terms, please contact us:</p>
				<Card className="mt-4">
					<CardContent className="pt-6">
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<Mail className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Email</p>
									<a
										href={`mailto:${LEGAL_CONFIG.emails.legal}`}
										className="text-primary hover:underline"
									>
										{LEGAL_CONFIG.emails.legal}
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
						</div>
					</CardContent>
				</Card>
			</LegalSection>

			{/* Summary */}
			<LegalSection id="summary" title="Summary of Key Points">
				<LegalTable
					columns={[
						{ key: "topic", header: "Topic" },
						{ key: "summary", header: "Summary" },
					]}
					data={[
						{
							topic: "Eligibility",
							summary: `Must be ${LEGAL_CONFIG.minimumAge}+ (${LEGAL_CONFIG.minimumAgeEU}+ in EU)`,
						},
						{
							topic: "Accounts",
							summary: "You're responsible for your account security",
						},
						{
							topic: "Server Listings",
							summary: "Subject to approval; must be accurate",
						},
						{
							topic: "Voting",
							summary: "One vote per server per 24 hours; no manipulation",
						},
						{ topic: "Reviews", summary: "Must be honest; no harassment" },
						{ topic: "Payments", summary: "No auto-renewal; limited refunds" },
						{
							topic: "Liability",
							summary: 'Service provided "as is"; limited liability',
						},
						{
							topic: "Disputes",
							summary: "Informal resolution first; individual claims only",
						},
					]}
				/>
			</LegalSection>
		</div>
	);
}

export const termsTocItems = [
	{ id: "agreement", title: "Agreement to Terms" },
	{ id: "eligibility", title: "Eligibility" },
	{ id: "accounts", title: "Account Registration" },
	{ id: "server-listings", title: "Server Listings" },
	{ id: "voting", title: "Voting System" },
	{ id: "reviews", title: "Reviews & User Content" },
	{ id: "payments", title: "Sponsorships & Payments" },
	{ id: "prohibited", title: "Prohibited Conduct" },
	{ id: "ip", title: "Intellectual Property" },
	{ id: "third-party", title: "Third-Party Services" },
	{ id: "disclaimers", title: "Disclaimers" },
	{ id: "liability", title: "Limitation of Liability" },
	{ id: "indemnification", title: "Indemnification" },
	{ id: "disputes", title: "Dispute Resolution" },
	{ id: "changes", title: "Changes to Terms" },
	{ id: "severability", title: "Severability" },
	{ id: "entire-agreement", title: "Entire Agreement" },
	{ id: "contact", title: "Contact Us" },
	{ id: "summary", title: "Summary" },
];
