// ── Embedded avatar ──
var SHILO = "data:image/png;base64,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";

var CLIENTS = [
  {name:"Advanced Pump",website:"advancedpump.com"},
  {name:"All Volleyball, Inc.",website:"allvolleyball.com"},
  {name:"Biddy Murphy",website:"biddymurphy.com"},
  {name:"Blue Moth Hearing",website:"bluemothhearing.com"},
  {name:"Bollman Hat Company",website:"bollmanhat.com"},
  {name:"BRobinson, LLC",website:"brobinson.com"},
  {name:"Buy Rite Beauty Supply",website:"buyrite.com"},
  {name:"Chantelle Lingerie, Inc.",website:"chantelle.com"},
  {name:"Creative Artisan",website:"creativeartisan.com"},
  {name:"Danielhouse Studios, Inc.",website:"danielhousestudios.com"},
  {name:"Dungarees",website:"dungarees.com"},
  {name:"eOutdoors",website:"eoutdoors.com"},
  {name:"Fauxliage",website:"fauxliage.com"},
  {name:"Grovemade",website:"grovemade.com"},
  {name:"Link Imaging",website:"linkimaging.com"},
  {name:"Microscope",website:"microscope.com"},
  {name:"MojoMotoSport",website:"mojomotosport.com"},
  {name:"MonkeySports",website:"monkeysports.com"},
  {name:"My Binding",website:"mybinding.com"},
  {name:"Network Innovations",website:"networkinnovations.com"},
  {name:"Nomadic Vintage Rugs",website:"nomadicvintagerugs.com"},
  {name:"Orchard and Vineyard Supply",website:"orchardandvineyard.com"},
  {name:"Outdoor Research",website:"outdoorresearch.com"},
  {name:"People's Choice Beef Jerky",website:"peopleschoice.com"},
  {name:"Poolaroo",website:"poolaroo.com"},
  {name:"Prepac Manufacturing Ltd.",website:"prepac.com"},
  {name:"Royal Swimming Pools",website:"royalswimmingpools.com"},
  {name:"ScaffoldMart",website:"scaffoldmart.com"},
  {name:"Simply Authentic LLC",website:"simplyauthentic.com"},
  {name:"Sunflora, Inc.",website:"sunflora.com"},
  {name:"Weaver",website:"weaver.com"},
  {name:"Windsor Plywood",website:"windsorplywood.com"},
];

var ISSUES = [
  {
    id:1, issue:'Outdoor Research | Billing and payment issue detected',
    client:'Outdoor Research', website:'outdoorresearch.com',
    severity:'action-required', status:'needs-review',
    discovered:'Dec 4, 2025', modified:'2 days ago',
    desc:'This account has an active billing or payment issue that requires immediate attention. Billing failures immediately halt all ad serving across the entire account — every hour of downtime represents lost conversions and revenue that cannot be recovered.',
    detection:'2 billing issues were detected in this Google Ads account via the Ads API. The primary payment method has a failed charge, and the primary card is expiring within 21 days.',
    affectedHeaders:['ISSUE','STATUS','URGENCY'],
    affectedRows:[
      ['Payment method declined','<span class="ic-badge-error">Declined</span>','Immediate — ads may be paused'],
      ['Primary card expiring soon','<span class="ic-badge-warning">Expires Feb 28, 2026</span>','21 days remaining'],
    ],
    impactBusiness:'Billing failures immediately halt all ad serving across the entire account. Paused accounts miss active demand in real time — every hour of downtime represents traffic and revenue that cannot be recovered. Recovery after a billing-related pause can take hours to days depending on the severity of the payment issue.',
    impactCauses:'Card on file has expired or been replaced without being updated in Google Ads. Bank declined the charge due to fraud protection, insufficient funds, or an international payment block.',
    resChange:'The payment method on the account needs to be valid and actively charging. For a declined charge, a working payment method must be in place immediately. For an expiring card, the card details need to be updated or replaced before the expiry date. The end state is a billing status of active with no outstanding payment failures.',
    resConsider:'StatBid does not have direct access to update payment methods — this requires action from the client. Contact the client immediately and confirm who on their side has access to billing. For a declined payment where ads may already be paused, escalate to the Account Manager and Client Success Manager — do not wait for a Slack reply alone. Ask the client to add a backup payment method at the same time to prevent recurrence.',
    resVerify:'The account billing status should show as active with no payment alerts or warnings. Campaigns that were paused due to the billing issue should resume serving with impressions and clicks coming through. The next daily rule run will confirm — if no billing issues are detected, this issue will move to Resolved automatically.',
  },
  {
    id:2, issue:'Dungarees | Attribution model mismatch',
    client:'Dungarees', website:'dungarees.com',
    severity:'action-required', status:'needs-review',
    discovered:'Dec 4, 2025', modified:'2 days ago',
    desc:'Primary conversion actions in this account are using Last Click attribution instead of Data-Driven Attribution (DDA). Suboptimal attribution causes Smart Bidding to misallocate conversion credit across touchpoints, leading to systematically inefficient spend allocation.',
    detection:'3 primary conversion actions are using Last Click attribution while meeting DDA eligibility thresholds (300+ conversions and 3,000+ clicks in the past 30 days). This is causing conversion values to diverge by more than 15% across 4 campaigns. Google reports DDA typically outperforms rules-based models by 5–10% in conversion volume at the same COS.',
    affectedHeaders:['CONVERSION ACTION','CURRENT MODEL','30-DAY CONVERSIONS','DDA ELIGIBLE','RECOMMENDED'],
    affectedRows:[
      ['Purchase','Last Click','847','<span class="ic-badge-success">✓ Yes</span>','Data-Driven'],
      ['Lead Form Submit','Last Click','312','<span class="ic-badge-success">✓ Yes</span>','Data-Driven'],
      ['Phone Call','Last Click','156','<span class="ic-badge-success">✓ Yes</span>','Data-Driven'],
    ],
    impactBusiness:'Mismatched attribution models mean that Smart Bidding interprets conversion credit incorrectly. Last Click overweights bottom-funnel touchpoints and undervalues awareness/consideration activity, causing bids to systematically over-invest in last-touch keywords and under-invest in upper-funnel campaigns.',
    impactCauses:'The Google Ads account was set up with Last Click before StatBid onboarded the client. The StatBid standard attribution model (Data-Driven) was not applied during onboarding, and the account has since accumulated enough conversion volume to qualify for DDA.',
    resChange:'Update the attribution model on each flagged primary conversion action to Data-Driven Attribution. The end state is no primary conversion actions using Last Click, First Click, Linear, or Position-Based models where DDA is available.',
    resConsider:'Attribution model changes affect how Smart Bidding interprets conversion credit going forward. Reported conversion numbers per keyword will likely shift after the change — this is expected behaviour, not data loss. Check the DDA Eligible column before acting; do not switch actions that are not yet eligible. Allow 2–4 weeks after making the change for bidding algorithms to fully stabilise with the new attribution signals.',
    resVerify:'The attribution model field on each updated conversion action should reflect Data-Driven Attribution. Allow 48–72 hours after the change before evaluating any shift in reported conversion distribution. The next weekly rule run will confirm the update is in place.',
  },
  {
    id:3, issue:'Outdoor Research | Campaign naming convention violation',
    client:'Outdoor Research', website:'outdoorresearch.com',
    severity:'information', status:'needs-review',
    discovered:'Dec 4, 2025', modified:'2 days ago',
    desc:'One or more campaigns in this account do not follow the required StatBid naming convention. Non-compliant campaign names prevent StatBid from correctly categorising campaigns in reports and may prevent automation rules from applying.',
    detection:'3 campaigns were found with names that do not match the required [SB] prefix and tier/type format.',
    affectedHeaders:['CAMPAIGN NAME','ISSUE','EXPECTED FORMAT'],
    affectedRows:[
      ['Brand Search US','Missing [SB] prefix','[SB] Brand: Search - US'],
      ['Shopping High Margin','Missing tier structure','[SB] High Margin: Shopping - US'],
      ['NonBrand_PMax_General','Non-standard format','[SB] Tier B: PMax - US'],
    ],
    impactBusiness:'Campaigns with non-compliant names are excluded from StatBid automation rules, meaning bidding, budgeting, and reporting logic does not apply to them. They also fall into the uncategorised bucket in Argos, making performance analysis inaccurate.',
    impactCauses:'Campaigns were created manually outside of StatBid without following the naming convention, or were renamed by the client without notifying the account team.',
    resChange:'Each non-compliant campaign name must be updated to match the required format: [SB] {Tier/Type}: {ChannelType} - {Market}. Renaming campaigns in Google Ads does not affect performance or history.',
    resConsider:'Use the Campaign Name Builder tool for reference when applying the correct naming format. Confirm the reporting label for each campaign aligns with the new name before renaming — a rename without a corresponding label update will still cause categorisation issues.',
    resVerify:'After renaming, the campaigns should no longer appear in the uncategorised bucket in StatBid, and automation rules should begin applying on the next processing cycle.',
  },
  {
    id:4, issue:'Outdoor Research | Impression share drop detected',
    client:'Outdoor Research', website:'outdoorresearch.com',
    severity:'review-recommended', status:'resolved',
    discovered:'Dec 4, 2025', modified:'2 days ago',
    desc:'Campaigns in this account have experienced a significant drop in impression share compared to their 30-day baseline. Lower impression share means ads are showing less frequently, directly reducing traffic volume and revenue potential.',
    detection:'3 campaigns have dropped more than 10 percentage points in impression share compared to their 30-day baseline (7-day rolling average vs prior 30 days). Lost IS (Rank) is the primary driver across two campaigns, indicating a competitiveness issue rather than budget constraints.',
    affectedHeaders:['CAMPAIGN','BASELINE IS','CURRENT IS','CHANGE','LOST IS (BUDGET)','LOST IS (RANK)','LIKELY CAUSE'],
    affectedRows:[
      ['[SB] Brand: Search - US','92%','71%','−21 pts','18%','11%','Budget limited'],
      ['[SB] Non-Brand: PMax - US','45%','28%','−17 pts','5%','67%','Rank / competition'],
      ['[SB] Tier B: Shopping - US','38%','25%','−13 pts','8%','54%','Investigate bids'],
    ],
    impactBusiness:'Lower impression share means ads are showing less frequently than they should, directly reducing the volume of traffic and conversions the account can capture. Brand campaigns should maintain 80%+ impression share — drops here may indicate competitor conquesting.',
    impactCauses:'Budget exhausted earlier in the day than usual, limiting afternoon/evening impression delivery. Increased competitor activity in the auction may be driving up CPCs and reducing ad rank for non-brand campaigns.',
    resChange:'There is no single prescribed fix for an impression share drop — the resolution depends entirely on the cause. Budget-driven drops require either a budget increase (if COS supports it) or an accepted constraint. Rank-driven drops require investigating whether bids, Quality Scores, or competitive pressure are responsible.',
    resConsider:'Check whether the account is hitting its COS target before acting. If COS is at or below target, the lost impression share is a revenue opportunity. If COS is above target, do not increase budget or lower tROAS — fix efficiency first. For rank-driven drops, check Auction Insights for competitor changes before concluding the drop is unexpected. If the drop is the result of a deliberate tROAS increase, mark the issue as Resolved manually and document the reasoning.',
    resVerify:'If action was taken, impression share should begin recovering toward the 30-day baseline within a few days. The next daily rule run checks whether the drop has recovered to within 5 percentage points of the baseline.',
  },
  {
    id:5, issue:'Grovemade | Missing reporting labels on campaigns',
    client:'Grovemade', website:'grovemade.com',
    severity:'action-required', status:'resolved',
    discovered:'Dec 4, 2025', modified:'2 days ago',
    desc:'Campaigns in this account are either missing their required reporting_label or have duplicate reporting_labels applied. Both conditions break Argos reporting — missing labels place campaigns in the uncategorised bucket, while duplicate labels cause double-counting in totals.',
    detection:'4 campaigns are missing their required reporting_label or have duplicate labels applied. These campaigns are either invisible in Argos reporting or inflating totals across multiple reporting groups.',
    affectedHeaders:['CAMPAIGN NAME','ISSUE TYPE','CURRENT LABELS'],
    affectedRows:[
      ['[SB] High Margin: Shopping - US','<span class="ic-badge-error">Missing Label</span>','(none)'],
      ['[SB] Brand: Search - US','<span class="ic-badge-warning">Duplicate Labels</span>','reporting_Brand, reporting_HighMargin'],
      ['[SB] Tier B: PMax - US','<span class="ic-badge-error">Missing Label</span>','(none)'],
      ['[SB] Non-Brand: Shopping - US','<span class="ic-badge-error">Missing Label</span>','(none)'],
    ],
    impactBusiness:'Campaigns without a reporting_label fall into the uncategorised bucket in Argos, making it impossible to accurately measure performance by reporting group. Duplicate labels cause double-counting in totals, which breaks all performance reporting and skews COS calculations.',
    impactCauses:'New campaigns were created without applying the appropriate reporting_label. A duplicate label was applied to an existing campaign without removing the prior one.',
    resChange:'Each flagged campaign needs to have exactly one reporting_label applied that matches its reporting group. For missing label campaigns, the correct label must be added. For duplicate label campaigns, all but the single correct label must be removed. The end state is every [SB] campaign having exactly one valid reporting_label.',
    resConsider:'The correct reporting_label should always align with the reporting group in the campaign name. If the campaign name and intended reporting group are inconsistent, resolve the naming question first. Confirm the label exists in the platform before applying it — label changes take approximately 24 hours to sync from Google Ads into Argos.',
    resVerify:'After the 24-hour sync window, the campaign should appear under the correct reporting group in Argos and no longer in the uncategorised bucket. For duplicate label fixes, confirm the campaign appears only once in reporting totals. The next weekly rule run will confirm each campaign has exactly one valid reporting_label.',
  },
  {
    id:6, issue:'Biddy Murphy | Attribution model mismatch',
    client:'Biddy Murphy', website:'biddymurphy.com',
    severity:'action-required', status:'resolved',
    discovered:'Dec 4, 2025', modified:'2 days ago',
    desc:'Primary conversion actions in this account are using Last Click attribution instead of Data-Driven Attribution. This causes Smart Bidding to misallocate conversion credit, leading to inefficient spend decisions across campaigns.',
    detection:'3 primary conversion actions are using Last Click attribution while meeting DDA eligibility thresholds. An average discrepancy of 16% in conversion attribution has been detected across 3 campaigns.',
    affectedHeaders:['CONVERSION ACTION','CURRENT MODEL','30-DAY CONVERSIONS','DDA ELIGIBLE','RECOMMENDED'],
    affectedRows:[
      ['Purchase','Last Click','623','<span class="ic-badge-success">✓ Yes</span>','Data-Driven'],
      ['Add to Cart','Last Click','1,840','<span class="ic-badge-success">✓ Yes</span>','Data-Driven'],
      ['Newsletter Signup','Last Click','89','<span class="ic-badge-warning">No — low volume</span>','Time Decay'],
    ],
    impactBusiness:"Mismatched attribution models mean StatBid's optimization decisions are based on conversion data that does not reflect how Google is crediting conversions. Last Click systematically overweights bottom-funnel touchpoints, causing the bidder to under-invest in upper-funnel campaigns that contribute to conversions.",
    impactCauses:'The Google Ads account was set up with Last Click before StatBid onboarded the client. The StatBid standard was not reconciled with the existing account setting during onboarding.',
    resChange:'Update the attribution model on each flagged primary conversion action to Data-Driven Attribution (DDA) where eligible. For the Newsletter Signup action which does not yet meet DDA thresholds, switch to Time Decay. The end state is no primary conversion actions using Last Click.',
    resConsider:'Changing attribution models in live accounts causes short-term fluctuation in reported conversions — this is expected, not data loss. Check DDA eligibility before acting; do not switch actions that are not DDA eligible. Allow 2–4 weeks for Smart Bidding to stabilise with the new attribution signals.',
    resVerify:'The attribution model field on each updated conversion action should reflect the new model. The next weekly rule run will confirm the update. Allow 48–72 hours before evaluating any shift in reported conversion distribution.',
  },
  {
    id:7, issue:'Advanced Pump | Conflicting negative keywords detected',
    client:'Advanced Pump', website:'advancedpump.com',
    severity:'action-required', status:'needs-review',
    discovered:'Dec 4, 2025', modified:'2 days ago',
    desc:'Active keywords in this account are being blocked by conflicting negative keywords, preventing ads from serving on intended search queries. Keywords appear active in the account but are generating zero impressions.',
    detection:'6 active keywords across 3 campaigns are being blocked by negative keywords. These keywords appear active in the account but generate zero impressions due to conflicts with shared negative lists.',
    affectedHeaders:['CAMPAIGN','AD GROUP','BLOCKED KEYWORD','NEGATIVE KEYWORD','SOURCE'],
    affectedRows:[
      ['[SB] Tier B: Category','Jackets','+leather +jacket','"leather"','[SB] Account Wide Negatives'],
      ['[SB] Tier B: Products','Free Spirit Fabrics','[free spirit fabrics]','free','[SB] Account Wide Negatives'],
      ['[SB] Tier B: Products','Free Spirit Fabrics','+free +spirit','"free spirit"','[SB] Account Wide Negatives'],
      ['[SB] Tier A: Brand','Brand Terms','+pump +solutions','solutions','Campaign Level'],
      ['[SB] Non-Brand: Search','Hydraulic','[hydraulic pump]','hydraulic','Ad Group Level'],
      ['[SB] Non-Brand: Search','Industrial','[industrial solutions]','solutions','[SB] Account Wide Negatives'],
    ],
    impactBusiness:'Blocked keywords generate zero impressions on queries the account is explicitly targeting, meaning ads are not showing despite active keywords being in place. If any of these are high-ROAS keywords, direct revenue loss is occurring silently.',
    impactCauses:'A negative keyword was added at the account or campaign level that is too broad and unintentionally blocks active positive keywords. Shared negative lists — when updated — can introduce conflicts across multiple campaigns simultaneously.',
    resChange:'Each blocking negative keyword needs to be removed, narrowed to a more specific match type, or — if the conflict is intentional — explicitly accepted. The end state is that every blocked keyword listed in Affected Items is eligible to serve on its intended queries.',
    resConsider:'Not every conflict is a mistake. Some negatives block traffic intentionally — for example, blocking a broad keyword to prevent tier overlap. Before removing anything, confirm whether the negative was added deliberately. If the negative lives on a shared account-wide list, removing it will affect every campaign attached to that list.',
    resVerify:'The previously blocked keywords should show as eligible to serve with no conflict status. The next daily rule run will confirm — if the conflict is gone, this issue will move to Resolved automatically. If the conflict was accepted as intentional, mark the issue as Resolved manually and document the reasoning.',
  },
  {
    id:8, issue:'Bollman Hat Company | Conflicting negative keywords detected',
    client:'Bollman Hat Company', website:'bollmanhat.com',
    severity:'action-required', status:'resolved',
    discovered:'Dec 4, 2025', modified:'2 days ago',
    desc:'Active keywords in this account are being blocked by conflicting negative keywords added to shared negative lists, preventing ads from serving on intended search queries.',
    detection:'4 active keywords across 2 campaigns are being blocked by negative keywords on shared negative lists. Keywords appear active but generate zero impressions due to over-broad negation at the list level.',
    affectedHeaders:['CAMPAIGN','AD GROUP','BLOCKED KEYWORD','NEGATIVE KEYWORD','SOURCE'],
    affectedRows:[
      ['[SB] Tier A: Search - US','Hats','+vintage +hat','"vintage"','[SB] Account Wide Negatives'],
      ['[SB] Tier A: Search - US','Caps','+vintage +cap','"vintage"','[SB] Account Wide Negatives'],
      ['[SB] Tier B: Shopping','All Products','[straw hat]','straw','Campaign Level'],
      ['[SB] Non-Brand: Search','Fedora','+felt +fedora','felt','Ad Group Level'],
    ],
    impactBusiness:'Blocked keywords generate zero impressions, causing direct revenue loss with no visibility into why performance has dropped. These appear as healthy active keywords in the account but are not serving on any queries.',
    impactCauses:'A shared negative list was updated and introduced conflicts across multiple campaigns. The "vintage" negative was likely added to block unwanted queries in one context but is too broad, also blocking intentional vintage hat keywords.',
    resChange:'Remove or narrow the conflicting negative keywords. For the "vintage" negative on the account-wide list, consider replacing it with a more specific phrase or exact match to block only unwanted queries while allowing vintage hat terms through.',
    resConsider:'Verify the negatives were not added intentionally before removing. If removing from a shared list, confirm the impact across all campaigns attached to that list — not just the ones flagged here.',
    resVerify:'Blocked keywords should show as eligible to serve on the next daily rule run. If the conflict was accepted as intentional, mark the issue as Resolved manually and document the rationale.',
  },
  {
    id:9,
    issue:'All Volleyball, Inc. | Campaign pacing below target',
    client:'All Volleyball, Inc.',
    website:'allvolleyball.com',
    severity:'review-recommended',
    status:'needs-review',
    discovered:'Dec 4, 2025',
    modified:'2 days ago',
    desc:'Multiple campaigns in this account are pacing significantly below their monthly budget allocation. When COS is within target and campaigns are underspending, the account is leaving conversions on the table that could be captured.',
    detection:'3 campaigns are projected to spend less than 55% of their monthly budget based on month-to-date pacing. Current COS is within target across all 3 campaigns, indicating the underspend is not intentional throttling but likely a bid, targeting, or delivery constraint.',
    affectedHeaders:['CAMPAIGN','DAILY BUDGET','PROJECTED SPEND','MONTHLY BUDGET','PACING','COS (TARGET: 28%)','STATUS'],
    affectedRows:[
      ['[SB] Non-Brand: PMax - US','$500','$8,200','$15,500','53%','22%','<span class="ic-badge-warning">Opportunity</span>'],
      ['[SB] Tier B: Category','$200','$2,800','$6,200','45%','25%','<span class="ic-badge-warning">Investigate</span>'],
      ['[SB] Brand: Search - US','$150','$1,900','$4,650','41%','19%','<span class="ic-badge-warning">Opportunity</span>'],
    ],
    impactBusiness:'Underspending means potential conversions are being left on the table. If COS is within target and campaigns have room to grow, every dollar not spent is a missed revenue opportunity. Clients expect their budget to be put to work — significant underspend requires explanation.',
    impactCauses:'tROAS targets may be set too aggressively relative to current market conditions, reducing bid competitiveness and delivery. Targeting may be too narrow (geographic, audience, or schedule restrictions), or ads may have disapprovals limiting delivery.',
    resChange:'Diagnose the root cause before making changes. If Lost IS (Rank) is high, loosen the tROAS target slightly to increase bids and volume. If targeting is too narrow, consider expanding geo or audience settings. If ads have disapprovals, fix and resubmit. The end state is campaigns spending at 75%+ of their monthly budget pacing.',
    resConsider:'Confirm COS is genuinely within target before acting — underspend with poor COS may be appropriate throttling by the algorithm. Check whether Budget Increaser/Decreaser scripts are active and functioning correctly, as they will not increase budget if COS is poor.',
    resVerify:'Spend should begin increasing within 24–72 hours of bid or targeting changes. The next daily run will update pacing projections. Issue auto-resolves when projected monthly spend reaches within 85% of budget.',
  },
  {
    id:10,
    issue:'Blue Moth Hearing | tROAS performance deviation',
    client:'Blue Moth Hearing',
    website:'bluemothhearing.com',
    severity:'action-required',
    status:'needs-review',
    discovered:'Dec 4, 2025',
    modified:'2 days ago',
    desc:'Campaigns using Target ROAS bidding are delivering actual ROAS significantly below their configured targets for more than 7 consecutive days. The bidding strategy is not functioning as intended and the account is overspending relative to revenue generated.',
    detection:'3 campaigns are averaging an actual ROAS of 178–210% against targets of 280–350%, representing a 28–40% deviation below target over the past 7 days. This sustained deviation suggests a structural issue rather than normal variance.',
    affectedHeaders:['CAMPAIGN NAME','TARGET ROAS','ACTUAL ROAS','DEVIATION','CONVERSIONS (7D)'],
    affectedRows:[
      ['[SB] Non-Brand: PMax - US','350%','210%','−40%','14'],
      ['[SB] Tier B: Shopping - US','300%','194%','−35%','9'],
      ['[SB] Brand: Search - US','280%','178%','−36%','22'],
    ],
    impactBusiness:"Missing ROAS targets means the account is generating less revenue per dollar spent than required by the client's COS goals. Sustained deviation compounding daily creates increasing financial exposure and may trigger invoice discounts.",
    impactCauses:'Possible rainshadow effect following a recent promotional period where the bidder is chasing performance that no longer exists. Conversion rate or AOV may have dropped due to a recent site change. Segment divergence (Mobile vs Desktop COS) may be masking the overall issue.',
    resChange:'Diagnose the deviation before acting. For a rainshadow effect, apply a negative seasonality adjustment (−30% to −50% for 2–3 days) or move campaigns to a fresh Portfolio Bid Strategy. If conversion rate or AOV has dropped, correct bids immediately to stop overspending then investigate the site. Avoid micro-adjusting tROAS targets based on short-term fluctuations.',
    resConsider:'Give the bidder at least 2–3 weeks to stabilise after any changes. Confirm Maximum Bid Limits on Portfolio Bid Strategies are set appropriately. Do not adjust tROAS targets repeatedly — choose one action and allow time to evaluate. Consult with SEM Analyst before applying Data Exclusions for post-promotional recovery.',
    resVerify:'Issue auto-resolves when actual ROAS returns to within acceptable range of target on the next daily run. Monitor CPC stability and impression/click volume trends. If a bid strategy was changed, allow 2–3 weeks during the learning period before drawing conclusions.',
  },
  {
    id:11,
    issue:'BRobinson, LLC | Disapproved ads detected',
    client:'BRobinson, LLC',
    website:'brobinson.com',
    severity:'action-required',
    status:'needs-review',
    discovered:'Dec 4, 2025',
    modified:'2 days ago',
    desc:'One or more ads in this account have been disapproved by Google and are not serving. Disapproved ads generate zero impressions, creating direct coverage gaps and compounding revenue loss the longer they remain unresolved.',
    detection:'3 ads across 2 campaigns have active disapprovals and are not eligible to serve on any queries. The oldest disapproval has been active for 5 days.',
    affectedHeaders:['CAMPAIGN','AD GROUP','AD TYPE','POLICY TOPIC','DISAPPROVED','DAYS','RECOMMENDED ACTION'],
    affectedRows:[
      ['[SB] Tier B: Shopping - US','All Products','Shopping','Destination not working','Dec 1, 2025','5','Fix landing page first'],
      ['[SB] Brand Search','Brand Terms','RSA','Misleading content','Dec 2, 2025','4','Review and appeal if compliant'],
      ['[SB] DSA - All Products','Dynamic Ads','DSA','Healthcare & medicines','Dec 4, 2025','2','Fix first — review claims'],
    ],
    impactBusiness:'Disapproved ads reduce campaign coverage and may prevent serving on high-value queries entirely. Even if some ads in an ad group are approved, disapproved ads may cover queries or products that approved ads do not, creating gaps in reach.',
    impactCauses:"Destination not working: landing page may be returning errors or loading too slowly. Misleading content: ad copy contains claims Google's system has flagged. Healthcare policy: ad or landing page may contain medical claims requiring additional compliance verification.",
    resChange:'Each disapproved ad requires a specific response. For "Destination not working", fix the landing page first before appealing. For "Misleading content" and "Healthcare", review the ad copy and landing page carefully — if compliant, dispute the decision; if not, fix first then appeal with "Made changes to comply".',
    resConsider:'Do not appeal legitimately disapproved ads without making changes — repeated unsuccessful appeals can negatively impact account standing. For regulated industries like healthcare, ensure proper disclaimers and certifications are in place before appealing. Monitor Policy Manager > Appeal history after submitting.',
    resVerify:'Appeals typically resolve within 24–48 hours. Monitor Policy Manager for status changes. The next daily rule run will detect when ad status changes to Approved. If an appeal is denied, review the denial reason and determine whether to fix and resubmit or escalate to Account Manager.',
  },
  {
    id:12,
    issue:'Buy Rite Beauty Supply | Low quality score on high-spend keywords',
    client:'Buy Rite Beauty Supply',
    website:'buyrite.com',
    severity:'review-recommended',
    status:'resolved',
    discovered:'Dec 4, 2025',
    modified:'2 days ago',
    desc:'Keywords responsible for a significant share of spend have quality scores below 5, increasing CPCs and reducing ad rank across high-value search queries.',
    detection:'12 keywords with a combined monthly spend of $8,400 have quality scores of 4 or below. Expected CTR and Ad Relevance are rated Below Average on 9 of the 12 flagged keywords.',
    affectedHeaders:['KEYWORD','CAMPAIGN','QUALITY SCORE','EXPECTED CTR','AD RELEVANCE','MONTHLY SPEND'],
    affectedRows:[
      ['beauty supply store','[SB] Brand: Search - US','3','Below Avg','Below Avg','$1,240'],
      ['professional hair products','[SB] Tier A: Search - US','4','Below Avg','Average','$980'],
      ['salon equipment','[SB] Tier B: Shopping','3','Below Avg','Below Avg','$760'],
      ['wholesale beauty supplies','[SB] Non-Brand: Search','4','Average','Below Avg','$620'],
    ],
    impactBusiness:'Low quality scores increase CPCs and reduce ad rank, making each impression more expensive. This directly erodes ROAS and means the account is paying more than competitors for equivalent visibility.',
    impactCauses:'Ad copy is not closely aligned with keyword intent, reducing Expected CTR. Landing pages may not directly address the query, lowering Landing Page Experience scores.',
    resChange:'Improve ad copy alignment with keyword intent for each flagged keyword. Review landing page relevance and ensure the destination directly addresses what the searcher is looking for. Consider pausing keywords with QS below 3 if improvement is not achievable within 30 days.',
    resConsider:'Quality Scores are a long-term metric — changes take 7–14 days to reflect after improvements are made. Prioritise fixes for the highest-spend keywords first. Ensure any landing page changes do not introduce new compliance issues.',
    resVerify:'Quality scores should begin updating within 7 days of making changes. Monitor CPCs on affected keywords for improvement as QS recovers. The goal is to bring flagged keywords to QS 6 or above.',
  },
  {
    id:13,
    issue:'Chantelle Lingerie, Inc. | Shopping feed errors detected',
    client:'Chantelle Lingerie, Inc.',
    website:'chantelle.com',
    severity:'action-required',
    status:'needs-review',
    discovered:'Dec 4, 2025',
    modified:'2 days ago',
    desc:'The Google Merchant Center feed for this account contains errors that are preventing products from serving in Shopping campaigns. Feed errors directly reduce eligible product inventory and campaign reach.',
    detection:'47 products are disapproved due to feed data quality issues. The primary error types are missing GTINs (31 products) and invalid pricing data (16 products).',
    affectedHeaders:['ERROR TYPE','AFFECTED PRODUCTS','SEVERITY','EXAMPLE PRODUCT'],
    affectedRows:[
      ['Missing GTIN','31','<span class="ic-badge-error">Disapproved</span>','Chantelle Inspire Bra - Black 34B'],
      ['Invalid pricing','16','<span class="ic-badge-error">Disapproved</span>','Chantelle Absolute Invisible Bra'],
      ['Image quality below minimum','8','<span class="ic-badge-warning">Limited</span>','Chantelle Basic Invisible Bra'],
    ],
    impactBusiness:'Feed errors directly reduce the number of eligible products in Shopping campaigns, limiting reach and revenue. 47 disapproved products are generating zero Shopping impressions regardless of bid levels or budget.',
    impactCauses:'Feed export may be misconfigured, missing GTIN fields for certain product categories. Pricing data may have a formatting issue — currency symbol conflicts or mismatched sale prices are common causes.',
    resChange:'Fix the specific error types shown in the Affected Items table and resubmit the feed. For missing GTINs, add valid UPC/EAN/ISBN codes. For invalid pricing, verify the price and sale_price fields are correctly formatted (numeric value + currency code).',
    resConsider:'Prioritise high-revenue product categories first when triaging. Check if errors originate in the feed source (Shopify/Magento export) or during feed processing. Some product types are exempt from GTIN requirements — confirm before adding arbitrary values.',
    resVerify:'Products typically re-enter the Shopping auction within 24–48 hours of feed reapproval. Monitor Merchant Center for feed processing status after resubmission. The next daily rule run will check whether disapproved product count has decreased.',
  },
  {
    id:14,
    issue:'Creative Artisan | Duplicate keywords across campaigns',
    client:'Creative Artisan',
    website:'creativeartisan.com',
    severity:'information',
    status:'resolved',
    discovered:'Dec 4, 2025',
    modified:'2 days ago',
    desc:'Keywords are appearing in multiple campaigns simultaneously, causing those campaigns to compete against each other in the auction and inflating CPCs through internal bid competition.',
    detection:'14 exact match keywords appear in 2 or more campaigns simultaneously. The duplicates span 3 campaign pairs and are creating measurable internal auction overlap.',
    affectedHeaders:['KEYWORD','CAMPAIGN 1','CAMPAIGN 2','MATCH TYPE','MONTHLY SPEND'],
    affectedRows:[
      ['[artisan craft supplies]','[SB] Tier A: Search','[SB] Tier B: Category','Exact','$340'],
      ['[handmade art materials]','[SB] Brand: Search','[SB] Tier A: Search','Exact','$280'],
      ['[custom art kits]','[SB] Tier B: Category','[SB] Non-Brand: PMax','Exact','$195'],
    ],
    impactBusiness:'Duplicate keywords inflate CPCs and reduce overall efficiency as campaigns bid against themselves in the same auction. This is measurable wasted spend that does not generate additional impressions.',
    impactCauses:'Campaigns were built from a shared keyword list without deduplication. Exact match keywords intended for one campaign tier were carried across into another during setup.',
    resChange:'Remove or negate duplicated keywords to prevent campaigns from competing internally. Decide which campaign should own each keyword based on tier structure, then negate it in the other campaign.',
    resConsider:'Generally the higher-tier campaign should retain the keyword, and a negative should be added to the lower-tier campaign. Confirm the intended campaign structure before deciding which copy to keep.',
    resVerify:'Auction overlap should resolve within 24 hours of removing duplicates. Monitor CPCs on affected keywords for reduction after deduplication is complete.',
  },
  {
    id:15,
    issue:'Danielhouse Studios, Inc. | High bounce rate on landing pages',
    client:'Danielhouse Studios, Inc.',
    website:'danielhousestudios.com',
    severity:'review-recommended',
    status:'needs-review',
    discovered:'Dec 4, 2025',
    modified:'2 days ago',
    desc:'Landing pages receiving paid traffic have a bounce rate above 70%, indicating a relevance or UX mismatch between ad messaging and page content. High bounce rates waste ad spend and lower Landing Page Experience scores.',
    detection:'3 landing pages receiving paid traffic show bounce rates between 74–89% over the past 30 days, significantly above the 45% benchmark for this account category.',
    affectedHeaders:['LANDING PAGE','BOUNCE RATE','SESSIONS','AVG. TIME ON PAGE','PRIMARY CAMPAIGN'],
    affectedRows:[
      ['/custom-framing','89%','1,240','0:18','[SB] Tier A: Search - US'],
      ['/art-prints','82%','890','0:24','[SB] Non-Brand: PMax'],
      ['/studio-commissions','74%','430','0:31','[SB] Brand: Search - US'],
    ],
    impactBusiness:'High bounce rates indicate that paid visitors are not finding what they expect, wasting ad spend on traffic that does not convert. Poor Landing Page Experience also contributes to lower Quality Scores, increasing CPCs.',
    impactCauses:'Ad copy and landing page messaging may be misaligned — ads promising one thing but pages delivering another. Pages may have technical issues (slow load time, mobile layout problems) that frustrate users before they engage.',
    resChange:'Review landing page content for alignment with ad messaging and keyword intent. Run a page speed test to check load times, especially on mobile. Confirm the primary CTA is clear and visible above the fold.',
    resConsider:"Check for page load speed issues — Google considers pages loading above 3 seconds as having poor Landing Page Experience. Mobile performance is often the primary cause for high bounce rates. Coordinate with the client's dev team if technical changes are needed.",
    resVerify:'Bounce rates typically improve within 2–4 weeks after landing page optimisation. Monitor Quality Scores for affected keywords alongside bounce rate — both should improve together if the root cause is landing page relevance.',
  },
  {
    id:16,
    issue:'eOutdoors | Missing conversion tracking tag',
    client:'eOutdoors',
    website:'eoutdoors.com',
    severity:'action-required',
    status:'needs-review',
    discovered:'Dec 4, 2025',
    modified:'2 days ago',
    desc:'The conversion tracking tag is not firing on one or more key pages, causing StatBid to miss conversion data. Missing conversion data prevents accurate ROAS calculation and disrupts automated bidding strategies that depend on conversion signals.',
    detection:'The primary purchase confirmation page has not recorded a conversion event in 3 days despite active traffic. Zero conversions have been recorded in Google Ads during this period while site analytics still shows purchases occurring.',
    affectedHeaders:['CONVERSION ACTION','STATUS','LAST CONVERSION','EXPECTED FREQUENCY','LIKELY CAUSE'],
    affectedRows:[
      ['Purchase','<span class="ic-badge-error">Not recording</span>','Dec 1, 2025','Daily','Tag missing from confirmation page'],
      ['Add to Cart','<span class="ic-badge-success">Recording normally</span>','Dec 4, 2025','Multiple/day','—'],
      ['Newsletter Signup','<span class="ic-badge-warning">Intermittent</span>','Dec 3, 2025','Daily','Tag firing conditionally'],
    ],
    impactBusiness:'Missing conversion data prevents accurate ROAS calculation and disrupts automated bidding strategies. Smart Bidding cannot optimise effectively without conversion signals, causing it to bid sub-optimally across all campaigns. Historical conversion data used by the bidder becomes increasingly stale.',
    impactCauses:'Tag was accidentally removed during a site update or CMS migration. A recent deployment may have changed the URL or DOM structure of the confirmation page, breaking the tag trigger condition.',
    resChange:'Verify the Google Ads conversion tag is present on the purchase confirmation page using Google Tag Assistant or GTM Preview mode. If missing, reinstall it via the same method originally used (direct tag or GTM trigger). Verify the trigger conditions match the current page URL structure.',
    resConsider:"Coordinate with the client's dev team if the tag needs to be reinstalled on a protected page. If using Google Tag Manager, check whether a recent GTM publish removed or altered the conversion trigger. Confirm the correct conversion action is being tracked.",
    resVerify:'Conversions should resume recording immediately after tag reinstallation. Verify by making a test purchase or using the Google Ads conversion status diagnostic tool. Monitor for 24–48 hours to confirm consistent recording before marking resolved.',
  },
  {
    id:17,
    issue:'Fauxliage | Bidding strategy conflict detected',
    client:'Fauxliage',
    website:'fauxliage.com',
    severity:'action-required',
    status:'needs-review',
    discovered:'Dec 4, 2025',
    modified:'2 days ago',
    desc:'Campaigns in this account are using conflicting bidding strategies that work against each other. A Maximize Clicks campaign sharing a budget with tROAS campaigns is consuming the majority of available spend without conversion goals.',
    detection:'2 campaigns are using Target ROAS while a third campaign shares their budget and uses Maximize Clicks. The Maximize Clicks campaign is consuming 71% of the shared budget without any conversion objective, starving the tROAS campaigns of spend.',
    affectedHeaders:['CAMPAIGN','BIDDING STRATEGY','SHARED BUDGET','BUDGET SHARE (7D)','CONVERSIONS (7D)'],
    affectedRows:[
      ['[SB] Tier A: Search - US','Target ROAS (350%)','[SB] Shared Budget','18%','24'],
      ['[SB] Non-Brand: PMax','Target ROAS (300%)','[SB] Shared Budget','11%','8'],
      ['[SB] Clicks Campaign','Maximize Clicks','[SB] Shared Budget','71%','1'],
    ],
    impactBusiness:'Conflicting strategies cause the shared budget to be consumed inefficiently by the Maximize Clicks campaign, which has no revenue goal. This starves the tROAS campaigns — which are actively optimising for conversions — of the budget they need to perform.',
    impactCauses:'Multiple campaigns were set up independently without a unified strategy review. The Maximize Clicks campaign was likely created for a specific short-term purpose but left running on the shared budget.',
    resChange:'Remove the Maximize Clicks campaign from the shared budget pool immediately — either assign it a separate standalone budget or pause it if no longer needed. Consolidate the remaining tROAS campaigns on a Portfolio Bid Strategy to coordinate bidding.',
    resConsider:'Confirm the Maximize Clicks campaign has a legitimate ongoing purpose before pausing it — coordinate with the client if uncertain. Use Portfolio Bid Strategies where possible to coordinate bidding across campaigns sharing a budget.',
    resVerify:'After aligning strategies, the tROAS campaigns should begin receiving their expected share of the budget within 24 hours. Allow 2 weeks for the new strategy configuration to exit the learning period before evaluating performance impact.',
  },
  {
    id:18,
    issue:'Link Imaging | Ad schedule gap during peak hours',
    client:'Link Imaging',
    website:'linkimaging.com',
    severity:'review-recommended',
    status:'resolved',
    discovered:'Dec 4, 2025',
    modified:'2 days ago',
    desc:'Ad scheduling settings are suppressing ads during historically high-converting hours. The current schedule is based on business hours rather than actual performance data, causing the account to miss its best conversion window.',
    detection:'Ads are paused between 7–9 PM on weekdays. This 2-hour window generated 18% of all conversions last month based on Google Ads hourly performance data.',
    affectedHeaders:['DAY/TIME WINDOW','SCHEDULE STATUS','CONVERSIONS LAST MONTH','% OF TOTAL','AVG COS'],
    affectedRows:[
      ['Weekdays 7–9 PM','<span class="ic-badge-error">Paused</span>','143','18%','21%'],
      ['Weekdays 9–11 PM','<span class="ic-badge-success">Active</span>','62','8%','24%'],
      ['Weekdays 12–2 PM','<span class="ic-badge-success">Active</span>','89','11%','26%'],
    ],
    impactBusiness:'Pausing during peak hours directly reduces the conversion volume the account can capture. 18% of monthly conversions being suppressed by an ad schedule setting represents a consistent, avoidable revenue loss every month.',
    impactCauses:'Ad schedule was configured based on business hours during initial account setup rather than performance data. The 7–9 PM window appears to be after-hours but is actually when this audience converts.',
    resChange:'Update the ad schedule to remove the suppression during the 7–9 PM weekday window. Review the full schedule across all campaigns before making changes to ensure consistency.',
    resConsider:'Confirm with the client that running ads during evening hours aligns with their operational expectations. Review the full ad schedule across all campaigns to identify any other windows where performance data contradicts current schedule settings.',
    resVerify:'Performance improvement should be visible within 7–14 days after schedule adjustment. Monitor conversion volume during the previously suppressed window to confirm ads are now serving and converting.',
  },
  {
    id:19,
    issue:'Microscope | Campaign budget shared pool imbalance',
    client:'Microscope',
    website:'microscope.com',
    severity:'information',
    status:'needs-review',
    discovered:'Dec 4, 2025',
    modified:'2 days ago',
    desc:'Campaigns sharing a budget pool have severely uneven spend distribution. One campaign is consuming nearly all available budget, preventing the other three from accessing the funds they need to deliver.',
    detection:'One campaign is consuming 91% of a shared budget that is designed to cover 4 campaigns. The remaining 3 campaigns — including the Brand Search campaign — are each spending less than 4% of the shared budget.',
    affectedHeaders:['CAMPAIGN','BUDGET SHARE (7D)','DAILY SPEND','CAMPAIGN TYPE','IMPRESSION SHARE'],
    affectedRows:[
      ['[SB] Non-Brand: PMax - US','91%','$412','PMax','High'],
      ['[SB] Tier A: Search - US','4%','$18','Search','Low'],
      ['[SB] Tier B: Shopping - US','3%','$14','Shopping','Low'],
      ['[SB] Brand: Search - US','2%','$9','Search','Low'],
    ],
    impactBusiness:'Dominant spend by one campaign prevents others from accessing the shared budget, reducing portfolio coverage. The Brand Search campaign receiving only 2% of the shared budget means brand terms are generating minimal impressions.',
    impactCauses:'The PMax campaign has broader targeting and higher bid targets than the other campaigns, causing Google to favour it when allocating the shared budget. PMax campaigns frequently dominate shared budgets due to their cross-channel reach.',
    resChange:'Consider splitting the dominant PMax campaign out to its own standalone budget to allow the remaining campaigns to access the shared pool. Review whether the shared budget structure is appropriate for this account or whether individual campaign budgets would provide better control.',
    resConsider:'Moving PMax to a standalone budget will likely increase its spend — confirm the budget level is appropriate before making the change. Review whether the current shared budget total is sufficient to support all 4 campaigns at their intended spend levels.',
    resVerify:'Spend distribution should rebalance within 3–5 days after budget restructuring. Monitor impression share on the previously constrained campaigns to confirm they are now receiving adequate budget.',
  },
  {
    id:20,
    issue:'MojoMotoSport | Audience list not attached to campaigns',
    client:'MojoMotoSport',
    website:'mojomotosport.com',
    severity:'review-recommended',
    status:'needs-review',
    discovered:'Dec 4, 2025',
    modified:'2 days ago',
    desc:'Remarketing and customer match audience lists exist in this account but are not attached to any campaigns. These lists represent valuable targeting signals that are currently unused, including a Customer Match list of over 10,000 users.',
    detection:'4 audience lists are unattached to any active campaign, including a Customer Match list of 10,400 users and a remarketing list of 6,200 past visitors.',
    affectedHeaders:['AUDIENCE LIST','TYPE','SIZE','STATUS','CAMPAIGNS ATTACHED'],
    affectedRows:[
      ['All Visitors (30d)','Remarketing','6,200 users','<span class="ic-badge-warning">Unattached</span>','0'],
      ['Customer Match — Purchase History','Customer Match','10,400 users','<span class="ic-badge-warning">Unattached</span>','0'],
      ['Cart Abandoners (14d)','Remarketing','2,100 users','<span class="ic-badge-warning">Unattached</span>','0'],
      ['High-Value Customers','Customer Match','1,800 users','<span class="ic-badge-warning">Unattached</span>','0'],
    ],
    impactBusiness:"Unattached audiences waste valuable targeting signals and prevent bid adjustments for known high-value users. The Customer Match list of 10,400 users represents the account's existing customer base — not using it means bidding the same amount for known customers as for unknown prospects.",
    impactCauses:'Audiences were imported or created but not yet assigned during campaign setup. The Customer Match list may have been uploaded recently by the client without notifying the account team.',
    resChange:'Attach each audience list to relevant campaigns as Observation mode layers. Start with Observation to gather data on how these audiences perform relative to non-audience traffic before switching to Targeting mode.',
    resConsider:'Start with Observation mode (not Targeting) to avoid restricting delivery while gathering data. Use performance segmentation data after 2–4 weeks to determine which audiences warrant bid adjustments. Confirm with the client that the Customer Match lists are up to date.',
    resVerify:'Audience data begins influencing bid decisions immediately after attachment in Observation mode. Review audience performance segmentation in the platform after 2–4 weeks to evaluate whether bid adjustments are warranted.',
  }
];

/* ═══════════════════════════════════════════════
   DASHBOARD — single unified script, no conflicts
═══════════════════════════════════════════════ */
(function () {

  /* ── helpers ── */
  function $(id) { return document.getElementById(id); }
  function toast(msg) {
    var t = $('toast-msg');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* ── filter state ── */
  var F = { search: '', client: '', website: '', severity: '', status: '' };
  var currentIssue = null;

  /* ── badge helpers ── */
  function sevBadge(s) {
    if (s === 'action-required')    return '<span class="badge badge-error">Action Required</span>';
    if (s === 'review-recommended') return '<span class="badge badge-warning">Review Recommended</span>';
    if (s === 'information')        return '<span class="badge badge-info">Information</span>';
    return s;
  }
  function statusBadge(s) {
    if (s === 'needs-review') return '<span class="badge badge-warning">Needs Review</span>';
    if (s === 'in-progress')  return '<span class="badge badge-info">In Progress</span>';
    if (s === 'resolved')     return '<span class="badge badge-success">Resolved</span>';
    return s;
  }
  function statusLabel(s) {
    if (s === 'needs-review') return 'Needs Review';
    if (s === 'in-progress')  return 'In Progress';
    if (s === 'resolved')     return 'Resolved';
    return 'Set Status';
  }

  /* ── render issues table ── */
  function renderTable() {
    var tbody = $('issues-tbody');
    if (!tbody) return;
    var list = ISSUES.filter(function (i) {
      if (F.search) {
        var q = F.search.toLowerCase();
        if (!i.issue.toLowerCase().includes(q) && !i.client.toLowerCase().includes(q) && !i.website.toLowerCase().includes(q)) return false;
      }
      if (F.client   && i.client   !== F.client)   return false;
      if (F.website  && i.website  !== F.website)   return false;
      if (F.severity && i.severity !== F.severity)  return false;
      if (F.status   && i.status   !== F.status)    return false;
      return true;
    });

    var badge = $('issue-count-badge');
    if (badge) badge.textContent = list.length + ' issue' + (list.length !== 1 ? 's' : '');

    var empty = $('table-empty');
    var tableCard = document.querySelector('.table-card');

    if (list.length === 0) {
      tbody.innerHTML = '';
      if (tableCard) tableCard.style.display = 'none';
      if (empty) empty.style.display = 'flex';
      return;
    }
    if (tableCard) tableCard.style.display = '';
    if (empty) empty.style.display = 'none';

    tbody.innerHTML = list.map(function (iss) {
      return '<tr data-id="' + iss.id + '">' +
        '<td class="td-cell" style="padding-left:16px;">' + iss.issue + '</td>' +
        '<td class="td-cell">' + sevBadge(iss.severity) + '</td>' +
        '<td class="td-cell">' + statusBadge(iss.status) + '</td>' +
        '<td class="td-cell td-muted">' + iss.discovered + '</td>' +
        '<td class="td-cell"><div class="modified-cell">' +
          '<img src="' + SHILO + '" class="modifier-avatar" alt="Shilo Jones" />' +
          '<div class="modifier-info"><span class="modifier-name">Shilo Jones</span><span class="modifier-time">' + iss.modified + '</span></div>' +
        '</div></td>' +
        '<td class="td-cell"><button class="action-btn" data-id="' + iss.id + '">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>' +
        '</button></td>' +
        '</tr>';
    }).join('');
  }

  /* ── open detail view ── */
  function openDetail(id) {
    var iss = ISSUES.find(function (i) { return i.id === id; });
    if (!iss) return;
    currentIssue = iss;

    $('ic-list').style.display = 'none';
    $('ic-detail').style.display = 'block';
    window.scrollTo(0, 0);

    $('detail-title').textContent = iss.issue;
    $('detail-severity-badge').innerHTML = sevBadge(iss.severity);
    $('detail-crumb-title').textContent = iss.issue;
    $('current-status-display').innerHTML = statusBadge(iss.status);
    var mrbtn = $('mark-resolved-btn');
    if (mrbtn) mrbtn.style.display = iss.status === 'resolved' ? 'none' : '';
    $('meta-client').textContent   = iss.client;
    $('meta-website').textContent  = iss.website;
    $('meta-date').textContent     = iss.discovered;
    $('detail-desc').textContent   = iss.desc;
    $('detection-body').textContent  = iss.detection;
    $('impact-biz-body').textContent = iss.impactBusiness;
    $('impact-causes-body').textContent = iss.impactCauses;
    $('res-change-body').textContent = iss.resChange;
    $('res-consider-body').textContent = iss.resConsider;
    $('res-verify-body').textContent = iss.resVerify;

    /* affected table */
    var hdrs = iss.affectedHeaders.map(function (h) { return '<th class="th-small">' + h + '</th>'; }).join('');
    var rows = iss.affectedRows.map(function (r) {
      return '<tr>' + r.map(function (c) { return '<td class="td-cell">' + c + '</td>'; }).join('') + '</tr>';
    }).join('');
    $('affected-table-wrap').innerHTML =
      '<table style="width:100%;border-collapse:collapse;">' +
      '<thead><tr style="background:var(--color-bg-grey50);">' + hdrs + '</tr></thead>' +
      '<tbody>' + rows + '</tbody></table>';

    /* reset tabs */
    document.querySelectorAll('.detail-tab').forEach(function (t) { t.classList.remove('active'); });
    document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
    document.querySelector('[data-tab="detection"]').classList.add('active');
    $('tab-detection').classList.add('active');
  }

  function backToList() {
    hideIntegrationsPage();
    hideFeedDataPage();
    $('ic-detail').style.display = 'none';
    $('ic-list').style.display = 'block';
    window.scrollTo(0, 0);
  }

  function showIntegrationsPage() {
    document.getElementById('ic-list').style.display = 'none';
    document.getElementById('ic-detail').style.display = 'none';
    document.getElementById('integrations-page').style.display = 'block';
    var fdp = document.getElementById('feed-data-page'); if (fdp) fdp.style.display = 'none';
    window.scrollTo(0, 0);
  }
  window.showIntegrationsPage = showIntegrationsPage;

  function hideIntegrationsPage() {
    document.getElementById('integrations-page').style.display = 'none';
  }

  function hideFeedDetailPages() {
    ['ic-list','db-overview-page','add-import-page','configure-import-page','field-mapping-page','row-detail-page','add-export-page','permission-manager-page','annotations-page','alerts-page','brm-page','overview-page','highlights-page'].forEach(function(id){ var el=document.getElementById(id); if(el) el.style.display='none'; });
  }
  window.hideFeedDetailPages = hideFeedDetailPages;

  function showFeedDataPage() {
    document.getElementById('ic-list').style.display = 'none';
    document.getElementById('ic-detail').style.display = 'none';
    document.getElementById('integrations-page').style.display = 'none';
    hideFeedDetailPages();
    var fdp = document.getElementById('feed-data-page'); if (fdp) fdp.style.display = 'block';
    window.scrollTo(0, 0);
  }
  function hideFeedDataPage() {
    var fdp = document.getElementById('feed-data-page'); if (fdp) fdp.style.display = 'none';
  }

  function initFeedDataPage() {

    /* ── group row collapse/expand ── */
    document.querySelectorAll('.feed-group-row').forEach(function(grpRow) {
      grpRow.addEventListener('click', function() {
        var grp = this.getAttribute('data-group');
        var isCollapsed = this.classList.toggle('collapsed');
        document.querySelectorAll('.feed-group-child[data-group="' + grp + '"]').forEach(function(child) {
          child.style.display = isCollapsed ? 'none' : '';
        });
      });
    });

    /* ── live search ── */
    var si = document.getElementById('feed-search');
    if (si) {
      si.addEventListener('input', function() {
        var q = this.value.toLowerCase();
        var fdp = document.getElementById('feed-data-page');
        if (!fdp) return;
        fdp.querySelectorAll('.feed-row').forEach(function(row) {
          var n = (row.getAttribute('data-name') || '').toLowerCase();
          var c = (row.getAttribute('data-client') || '').toLowerCase();
          var grpRow = row.closest('tbody') && document.querySelector('.feed-group-row[data-group="' + row.getAttribute('data-group') + '"]');
          var grpCollapsed = grpRow && grpRow.classList.contains('collapsed');
          var show = (!q || n.includes(q) || c.includes(q)) && !grpCollapsed;
          row.style.display = show ? '' : 'none';
        });
      });
    }

    /* ── ⋮ action menus (delegated, feed-data-page only) ── */
    document.addEventListener('click', function(e) {
      if (e.target.closest('.feed-action-btn')) {
        e.stopPropagation();
        var menu = e.target.closest('.feed-action-btn').nextElementSibling;
        var isOpen = menu && menu.classList.contains('open');
        document.querySelectorAll('.feed-action-menu.open').forEach(function(m){ m.classList.remove('open'); });
        if (menu && !isOpen) menu.classList.add('open');
        return;
      }
      if (!e.target.closest('.feed-action-menu')) {
        document.querySelectorAll('.feed-action-menu.open').forEach(function(m){ m.classList.remove('open'); });
      }
    });

    /* ── "Create new group +" prompt ── */
    var groupSel = document.getElementById('add-feed-group-select');
    if (groupSel) {
      groupSel.addEventListener('change', function() {
        if (this.value === '__new__') {
          var name = prompt('Group name:');
          if (name && name.trim()) {
            var opt = document.createElement('option');
            opt.value = 'grp-' + name.trim().toLowerCase().replace(/\s+/g,'-');
            opt.textContent = name.trim();
            this.insertBefore(opt, this.querySelector('[value="__new__"]'));
            this.value = opt.value;
          } else { this.value = ''; }
        }
      });
    }

    /* ── Add Database modal — now handled by openAddDbModal() ── */
    var addModal = document.getElementById('add-feed-modal');
    var cancelBtn = document.getElementById('add-feed-cancel');
    if (addModal && cancelBtn) {
      cancelBtn.addEventListener('click', function() { addModal.style.display = 'none'; });
      addModal.addEventListener('click', function(e){ if (e.target === addModal) addModal.style.display = 'none'; });
    }
  }
  initFeedDataPage();

    /* ═══════════════════════════════════════════
       FEED DATA TOOL — STATE
    ═══════════════════════════════════════════ */
    var currentDb = { name:'', client:'', group:'' };
    var importSource = '';
    var importType = '';
    var wizardStep = 1;

    /* ═══════════════════════════════════════════
       ADD DATABASE MODAL
    ═══════════════════════════════════════════ */
    function openAddDbModal() {
      var modal = document.getElementById('add-db-modal');
      if (!modal) return;
      // populate client select
      var sel = document.getElementById('add-db-client');
      if (sel && sel.options.length <= 1 && typeof CLIENTS !== 'undefined') {
        CLIENTS.forEach(function(c) {
          var opt = document.createElement('option');
          opt.value = c.name.toLowerCase();
          opt.textContent = c.name;
          sel.appendChild(opt);
        });
      }
      // reset fields
      document.getElementById('add-db-name').value = '';
      document.getElementById('add-db-name').classList.remove('error');
      document.getElementById('add-db-name-error').classList.remove('visible');
      document.getElementById('add-db-group').value = '';
      document.getElementById('add-db-new-group-wrap').style.display = 'none';
      modal.style.display = 'flex';
    }
    window.openAddDbModal = openAddDbModal;

    function closeAddDbModal() {
      var modal = document.getElementById('add-db-modal');
      if (modal) modal.style.display = 'none';
    }
    window.closeAddDbModal = closeAddDbModal;

    function handleAddDbGroupChange(val) {
      var wrap = document.getElementById('add-db-new-group-wrap');
      if (!wrap) return;
      wrap.style.display = val === '__new__' ? 'flex' : 'none';
    }
    window.handleAddDbGroupChange = handleAddDbGroupChange;

    function clearNewGroup() {
      document.getElementById('add-db-new-group-name').value = '';
      document.getElementById('add-db-group').value = '';
      document.getElementById('add-db-new-group-wrap').style.display = 'none';
    }
    window.clearNewGroup = clearNewGroup;

    function submitAddDb() {
      var nameEl = document.getElementById('add-db-name');
      var nameErr = document.getElementById('add-db-name-error');
      var dbName = (nameEl.value || '').trim();
      if (!dbName) {
        nameEl.classList.add('error');
        nameErr.classList.add('visible');
        return;
      }
      nameEl.classList.remove('error');
      nameErr.classList.remove('visible');

      var clientVal = document.getElementById('add-db-client');
      var clientName = clientVal ? clientVal.options[clientVal.selectedIndex].text : '';
      if (clientVal && clientVal.value === '') clientName = '';

      var groupSel = document.getElementById('add-db-group');
      var groupVal = groupSel ? groupSel.value : '';
      var isNewGroup = groupVal === '__new__';
      var newGroupName = isNewGroup ? (document.getElementById('add-db-new-group-name').value || '').trim() : '';

      var actionMenu = '<div class="feed-action-wrap"><button class="feed-action-btn">⋮</button><div class="feed-action-menu"><div class="dd-item">View Details</div><div class="dd-item">Edit Feed</div><div class="dd-item">Pause Imports</div><div class="dd-item">Pause Exports</div><div style="height:1px;background:var(--color-border);margin:4px 2px;"></div><div class="dd-item danger">Delete Feed</div></div></div>';

      if (isNewGroup && newGroupName) {
        // Add to grouped table as a new group
        var grpTbody = document.querySelector('#feed-grouped-table tbody');
        if (grpTbody) {
          var grpId = 'grp-' + newGroupName.toLowerCase().replace(/\s+/g, '-');
          var grpRow = '<tr class="feed-group-row" data-group="' + grpId + '"><td colspan="6"><div class="feed-group-row-inner"><svg class="feed-group-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg><span class="feed-group-label">' + newGroupName + '</span><span class="feed-group-pill">1 feed</span></div></td></tr>';
          var childRow = '<tr class="feed-row feed-group-child" data-group="' + grpId + '" data-name="' + dbName.toLowerCase() + '" data-client="' + (clientName || newGroupName).toLowerCase() + '"><td><span class="feed-name">' + dbName + '</span></td><td><span class="feed-client-link">' + (clientName || '—') + '</span></td><td><span class="feed-import-count">0 Imports</span></td><td><span class="feed-import-count">0 Exports</span></td><td><span class="activity-type">—</span><span class="activity-time"> Just now</span></td><td>' + actionMenu + '</td></tr>';
          grpTbody.insertAdjacentHTML('beforeend', grpRow + childRow);
          // wire up group toggle
          var newGrpRow = grpTbody.querySelector('[data-group="' + grpId + '"].feed-group-row');
          if (newGrpRow) {
            newGrpRow.addEventListener('click', function() {
              var grp = this.getAttribute('data-group');
              var isCollapsed = this.classList.toggle('collapsed');
              document.querySelectorAll('.feed-group-child[data-group="' + grp + '"]').forEach(function(child) {
                child.style.display = isCollapsed ? 'none' : '';
              });
            });
          }
        }
      } else {
        // Add to ungrouped table
        var ungTbody = document.getElementById('feed-ungrouped-body');
        if (ungTbody) {
          var newRow = '<tr class="feed-row" data-name="' + dbName.toLowerCase() + '" data-client="' + clientName.toLowerCase() + '"><td><span class="feed-name">' + dbName + '</span></td><td><span class="feed-client-link">' + (clientName || '—') + '</span></td><td><span class="feed-import-count">0 Imports</span></td><td><span class="feed-import-count">0 Exports</span></td><td><span class="activity-type">—</span><span class="activity-time"> Just now</span></td><td>' + actionMenu + '</td></tr>';
          ungTbody.insertAdjacentHTML('beforeend', newRow);
        }
      }

      showToast('Database added successfully');
      closeAddDbModal();
    }
    window.submitAddDb = submitAddDb;

    /* Backdrop click to close add-db-modal */
    (function() {
      var m = document.getElementById('add-db-modal');
      if (m) m.addEventListener('click', function(e) { if (e.target === this) closeAddDbModal(); });
    })();

    /* Wire up #add-feed-btn to openAddDbModal */
    (function() {
      var btn = document.getElementById('add-feed-btn');
      if (btn) btn.onclick = openAddDbModal;
    })();

    /* ═══════════════════════════════════════════
       DATABASE OVERVIEW
    ═══════════════════════════════════════════ */
    function showDbOverviewPage(db) {
      currentDb = db || currentDb;
      hideFeedDataPage();
      hideAddImportPage();
      hideConfigureImportPage();
      var page = document.getElementById('db-overview-page');
      if (!page) return;
      // populate header
      var titleEl = document.getElementById('db-overview-title');
      if (titleEl) titleEl.textContent = currentDb.name || 'Database';
      var clientPill = document.getElementById('db-overview-client-pill');
      if (clientPill) clientPill.textContent = 'Client: ' + (currentDb.client || '—');
      var groupPill = document.getElementById('db-overview-group-pill');
      if (groupPill) groupPill.textContent = currentDb.group || 'Ungrouped';
      var bcName = document.getElementById('db-overview-bc-name');
      if (bcName) bcName.textContent = currentDb.name || 'Database';
      // update add-import breadcrumb
      var aiBc = document.getElementById('add-import-db-bc');
      if (aiBc) aiBc.textContent = currentDb.name || 'Database';
      var cfgBc = document.getElementById('cfg-import-db-bc');
      if (cfgBc) cfgBc.textContent = currentDb.name || 'Database';
      // activate overview tab
      switchDbTab('overview');
      page.style.display = 'block';
      window.scrollTo(0,0);
    }
    window.showDbOverviewPage = showDbOverviewPage;

    function hideDbOverviewPage() {
      var page = document.getElementById('db-overview-page');
      if (page) page.style.display = 'none';
    }
    window.hideDbOverviewPage = hideDbOverviewPage;

    function switchDbTab(tabName) {
      document.querySelectorAll('#db-tabs-bar .detail-tab').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('#db-overview-page .tab-panel').forEach(function(p) { p.classList.remove('active'); });
      var activeTab = document.querySelector('#db-tabs-bar [data-dbtab="' + tabName + '"]');
      if (activeTab) activeTab.classList.add('active');
      var activePanel = document.getElementById('db-tab-' + tabName);
      if (activePanel) activePanel.classList.add('active');
    }
    window.switchDbTab = switchDbTab;

    /* DB tab bar click wiring */
    document.addEventListener('click', function(e) {
      var tab = e.target.closest('#db-tabs-bar .detail-tab');
      if (!tab) return;
      switchDbTab(tab.getAttribute('data-dbtab'));
    });

    /* Feed table row click → DB Overview */
    (function() {
      var card = document.getElementById('feed-table-card');
      if (!card) return;
      card.addEventListener('click', function(e) {
        if (e.target.closest('.feed-action-btn') || e.target.closest('.feed-group-row')) return;
        var row = e.target.closest('.feed-row');
        if (!row) return;
        var nameEl = row.querySelector('.feed-name');
        var clientEl = row.querySelector('.feed-client-link');
        var isGrouped = row.classList.contains('feed-group-child');
        var groupName = 'Ungrouped';
        if (isGrouped) {
          var grpLabelEl = row.closest('tbody') && row.closest('tbody').querySelector('.feed-group-label');
          groupName = grpLabelEl ? grpLabelEl.textContent : 'Grouped';
        }
        showDbOverviewPage({
          name: nameEl ? nameEl.textContent : '',
          client: clientEl ? clientEl.textContent : (row.getAttribute('data-client') || ''),
          group: groupName
        });
      });
    })();

    /* ═══════════════════════════════════════════
       ADD IMPORT PAGE
    ═══════════════════════════════════════════ */
    function showAddImportPage() {
      hideDbOverviewPage();
      hideConfigureImportPage();
      importSource = '';
      importType = '';
      // reset card selections
      document.querySelectorAll('.source-card').forEach(function(c){ c.classList.remove('selected'); });
      document.querySelectorAll('.type-card').forEach(function(c){ c.classList.remove('selected'); });
      updateContinueBtn();
      var page = document.getElementById('add-import-page');
      if (page) page.style.display = 'block';
      window.scrollTo(0,0);
    }
    window.showAddImportPage = showAddImportPage;

    function hideAddImportPage() {
      var page = document.getElementById('add-import-page');
      if (page) page.style.display = 'none';
    }
    window.hideAddImportPage = hideAddImportPage;

    function selectImportSource(src) {
      importSource = src;
      document.querySelectorAll('.source-card').forEach(function(c){ c.classList.remove('selected'); });
      var map = {Shopify:'src-shopify', CSV:'src-csv', SFTP:'src-sftp'};
      var el = document.getElementById(map[src]);
      if (el) el.classList.add('selected');
      updateContinueBtn();
    }
    window.selectImportSource = selectImportSource;

    function selectImportType(type) {
      importType = type;
      document.querySelectorAll('.type-card').forEach(function(c){ c.classList.remove('selected'); });
      var map = {'Main Feed':'type-mainfeed', 'Join Feed':'type-joinfeed'};
      var el = document.getElementById(map[type]);
      if (el) el.classList.add('selected');
      updateContinueBtn();
    }
    window.selectImportType = selectImportType;

    function updateContinueBtn() {
      var btn = document.getElementById('add-import-continue-btn');
      if (!btn) return;
      if (importSource && importType) {
        btn.disabled = false;
        btn.classList.remove('disabled');
      } else {
        btn.disabled = true;
        btn.classList.add('disabled');
      }
    }

    function continueToConfigureImport() {
      if (!importSource || !importType) return;
      showConfigureImportPage(importSource, importType);
    }
    window.continueToConfigureImport = continueToConfigureImport;

    function cancelAddImport() {
      hideAddImportPage();
      showDbOverviewPage(currentDb);
      switchDbTab('imports');
    }
    window.cancelAddImport = cancelAddImport;

    /* ═══════════════════════════════════════════
       CONFIGURE IMPORT WIZARD
    ═══════════════════════════════════════════ */
    var sourceColors = {Shopify:'#96bf48', CSV:'#6b7280', SFTP:'#374151'};

    function showConfigureImportPage(src, type) {
      importSource = src || importSource;
      importType = type || importType;
      hideAddImportPage();
      hideDbOverviewPage();
      // populate sub-header badges
      var srcBadge = document.getElementById('cfg-source-badge');
      if (srcBadge) {
        srcBadge.textContent = importSource;
        srcBadge.style.background = sourceColors[importSource] || '#6b7280';
      }
      var typeBadge = document.getElementById('cfg-type-badge');
      if (typeBadge) typeBadge.textContent = importType;
      // reset to step 1
      goWizardStepDirect(1);
      var page = document.getElementById('configure-import-page');
      if (page) page.style.display = 'block';
      window.scrollTo(0,0);
    }
    window.showConfigureImportPage = showConfigureImportPage;

    function hideConfigureImportPage() {
      var page = document.getElementById('configure-import-page');
      if (page) page.style.display = 'none';
    }
    window.hideConfigureImportPage = hideConfigureImportPage;

    function goWizardStepDirect(n) {
      wizardStep = n;
      document.querySelectorAll('.wizard-step').forEach(function(s){ s.classList.remove('active'); });
      var step = document.getElementById('wizard-step-' + n);
      if (step) step.classList.add('active');
      // update wizard tab active state
      document.querySelectorAll('#wizard-tabs-bar .detail-tab').forEach(function(t){ t.classList.remove('active'); });
      var activeWizTab = document.querySelector('#wizard-tabs-bar [data-wizardtab="' + n + '"]');
      if (activeWizTab) activeWizTab.classList.add('active');
    }

    function goWizardStep(n) {
      // validate current step
      if (wizardStep === 1) {
        var nameEl = document.getElementById('wizard-import-name');
        var nameErr = document.getElementById('wizard-name-error');
        if (n > 1 && nameEl && !nameEl.value.trim()) {
          nameEl.classList.add('error');
          nameErr.classList.add('visible');
          return;
        }
        if (nameEl) nameEl.classList.remove('error');
        if (nameErr) nameErr.classList.remove('visible');
      }
      goWizardStepDirect(n);
    }
    window.goWizardStep = goWizardStep;

    /* Wizard tab clicks */
    document.addEventListener('click', function(e) {
      var wTab = e.target.closest('#wizard-tabs-bar .detail-tab');
      if (!wTab) return;
      var n = parseInt(wTab.getAttribute('data-wizardtab'), 10);
      if (n && n <= wizardStep + 1) goWizardStep(n);
    });

    function togglePasswordField(inputId, btn) {
      var input = document.getElementById(inputId);
      if (!input) return;
      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
      } else {
        input.type = 'password';
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
      }
    }
    window.togglePasswordField = togglePasswordField;

    function handleFrequencyChange(val) {
      var fields = document.getElementById('custom-schedule-fields');
      if (fields) fields.style.display = val === 'custom' ? 'block' : 'none';
    }
    window.handleFrequencyChange = handleFrequencyChange;

    function addFilterRow() {
      var tbody = document.getElementById('filter-rows-tbody');
      if (!tbody) return;
      var tr = document.createElement('tr');
      tr.innerHTML = '<td><input type="text" class="modal-input" placeholder="Filter" style="padding:5px 8px;font-size:13px;"></td><td><input type="text" class="modal-input" placeholder="Value" style="padding:5px 8px;font-size:13px;"></td><td><button class="btn-danger-icon" onclick="removeFilterRow(this)" title="Remove"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button></td>';
      tbody.appendChild(tr);
    }
    window.addFilterRow = addFilterRow;

    function removeFilterRow(btn) {
      var tr = btn.closest('tr');
      if (tr) tr.remove();
    }
    window.removeFilterRow = removeFilterRow;

    function cancelConfigureImport() {
      hideConfigureImportPage();
      showDbOverviewPage(currentDb);
      switchDbTab('imports');
    }
    window.cancelConfigureImport = cancelConfigureImport;

    function submitImport() {
      var importName = (document.getElementById('wizard-import-name') && document.getElementById('wizard-import-name').value.trim()) || 'New Import';
      // add row to imports table
      var tbody = document.getElementById('imports-tbody');
      if (tbody) {
        var dot = sourceColors[importSource] || '#6b7280';
        var actionMenu = '<div class="feed-action-wrap"><button class="feed-action-btn">⋮</button><div class="feed-action-menu"><div class="dd-item">View Details</div><div class="dd-item">Edit Import</div><div class="dd-item">Pause Import</div><div style="height:1px;background:var(--color-border);margin:4px 2px;"></div><div class="dd-item danger">Delete Import</div></div></div>';
        var row = '<tr class="feed-row"><td><span class="feed-name">' + importName + '</span></td><td><span style="display:inline-flex;align-items:center;"><span class="source-dot" style="background:' + dot + ';"></span>' + importSource + '</span></td><td>' + importType + '</td><td>—</td><td>—</td><td>Just configured</td><td>' + actionMenu + '</td></tr>';
        tbody.insertAdjacentHTML('beforeend', row);
      }
      hideConfigureImportPage();
      showDbOverviewPage(currentDb);
      switchDbTab('imports');
      showToast('Import configured successfully');
    }
    window.submitImport = submitImport;

  /* ── build client/website dropdowns ── */
  function buildClientMenu() {
    var m = $('client-menu');
    if (!m) return;
    m.innerHTML = '<div class="dd-item dd-active" data-filter="client" data-val="">All Clients</div>' +
      CLIENTS.map(function (c) {
        return '<div class="dd-item" data-filter="client" data-val="' + c.name + '">' + c.name + '</div>';
      }).join('');
  }
  function buildWebsiteMenu(clientName) {
    var m = $('website-menu');
    if (!m) return;
    var sites = clientName
      ? CLIENTS.filter(function (c) { return c.name === clientName; }).map(function (c) { return c.website; })
      : CLIENTS.map(function (c) { return c.website; });
    m.innerHTML = '<div class="dd-item dd-active" data-filter="website" data-val="">All Websites</div>' +
      sites.map(function (s) {
        return '<div class="dd-item" data-filter="website" data-val="' + s + '">' + s + '</div>';
      }).join('');
  }

  /* ── dropdown open/close ── */
  function closeAllDropdowns(except) {
    document.querySelectorAll('.dropdown-menu').forEach(function (m) {
      if (m !== except) m.classList.remove('open');
    });
  }
  function toggleDropdown(menuId) {
    var m = $(menuId);
    if (!m) return;
    var wasOpen = m.classList.contains('open');
    closeAllDropdowns(m);
    if (wasOpen) m.classList.remove('open');
    else m.classList.add('open');
  }

  /* ── sidebar group toggle ── */
  function initSidebar() {
    document.querySelectorAll('.sb-group-hdr').forEach(function (hdr) {
      hdr.addEventListener('click', function (e) {
        e.stopPropagation();
        var grpId = this.getAttribute('data-grp');
        var kids = $('kids-' + grpId);
        if (!kids) return;
        var isOpen = kids.classList.contains('sb-kids-open');

        /* close all */
        document.querySelectorAll('.sb-kids').forEach(function (k) { k.classList.remove('sb-kids-open'); });
        document.querySelectorAll('.sb-group-hdr').forEach(function (h) {
          h.classList.remove('sb-hdr-active');
          var c = h.querySelector('.sb-chev');
          if (c) c.classList.remove('sb-chev-open');
        });

        /* open clicked (if it was closed) */
        if (!isOpen) {
          kids.classList.add('sb-kids-open');
          this.classList.add('sb-hdr-active');
          var chev = this.querySelector('.sb-chev');
          if (chev) chev.classList.add('sb-chev-open');
        }
      });
    });

    /* nav items */
    document.querySelectorAll('.sb-kid').forEach(function (kid) {
      kid.addEventListener('click', function (e) {
        e.stopPropagation();
        document.querySelectorAll('.sb-kid').forEach(function (k) { k.classList.remove('sb-kid-active'); });
        this.classList.add('sb-kid-active');
        // hide all feed sub-pages on any nav click
        if (typeof hideFeedDetailPages === 'function') hideFeedDetailPages();
        var fdp = document.getElementById('feed-data-page'); if (fdp) fdp.style.display = 'none';
        if (this.getAttribute('data-nav') === 'issue-center') {
          backToList();
        }
        if (this.getAttribute('data-nav') === 'integrations') {
          showIntegrationsPage();
        }
        if (this.getAttribute('data-nav') === 'feed-data') {
          showFeedDataPage();
        }
        if (this.getAttribute('data-nav') === 'permission-manager') {
          showPermissionManagerPage();
        }
        if (this.getAttribute('data-nav') === 'annotations') {
          showAnnotationsPage();
        }
        if (this.getAttribute('data-nav') === 'alerts') {
          showAlertsPage();
        }
        if (this.getAttribute('data-nav') === 'biz-rules') {
          showBrmPage();
        }
        if (this.getAttribute('data-nav') === 'sem-overview') {
          showOverviewPage();
        }
        if (this.getAttribute('data-nav') === 'highlights-table') {
          showHighlightsPage();
        }
      });
    });

    /* collapse toggle */
    var toggleBtn = $('sb-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        document.body.classList.toggle('sidebar-collapsed');
      });
    }

    /* dark mode */
    var darkBtn = $('sb-dark-btn');
    if (darkBtn) {
      darkBtn.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        var lbl = $('dark-mode-label');
        if (lbl) lbl.textContent = document.body.classList.contains('dark-mode') ? 'Disable Dark Mode' : 'Enable Dark Mode';
      });
    }
  }

  /* ── global click delegation ── */
  function initEvents() {
    /* Table row click */
    var tbody = $('issues-tbody');
    if (tbody) {
      tbody.addEventListener('click', function (e) {
        var row = e.target.closest('tr[data-id]');
        if (row) openDetail(parseInt(row.getAttribute('data-id')));
      });
    }

    /* Back to list */
    [$('bc-back'), $('bc-back2')].forEach(function (el) {
      if (el) el.addEventListener('click', backToList);
    });

    /* Detail tabs */
    document.querySelectorAll('.detail-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.detail-tab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        var panel = $(tab.getAttribute('data-tab') ? 'tab-' + tab.getAttribute('data-tab') : null);
        if (panel) panel.classList.add('active');
      });
    });

    /* Filter dropdowns — trigger buttons */
    var ddButtons = [
      ['client-btn',    'client-menu'],
      ['website-btn',   'website-menu'],
      ['sev-btn',       'sev-menu'],
      ['status-btn',    'status-menu'],
      ['date-btn',      'date-menu'],
      ['set-status-btn','set-status-menu'],
    ];
    ddButtons.forEach(function (pair) {
      var btn = $(pair[0]);
      if (btn) btn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleDropdown(pair[1]);
      });
    });

    /* Dropdown item clicks */
    document.addEventListener('click', function (e) {
      /* close all on outside click */
      if (!e.target.closest('.dd-trigger-wrap') && !e.target.closest('.dropdown-menu')) {
        closeAllDropdowns(null);
      }

      var item = e.target.closest('.dd-item');
      if (!item) return;

      var filterType = item.getAttribute('data-filter');
      var val = item.getAttribute('data-val');

      /* mark active in menu */
      var menu = item.closest('.dropdown-menu');
      if (menu) {
        menu.querySelectorAll('.dd-item').forEach(function (i) { i.classList.remove('dd-active'); });
        item.classList.add('dd-active');
        menu.classList.remove('open');
      }

      if (filterType === 'client') {
        F.client = val; F.website = '';
        $('client-label').textContent = val ? 'Client: ' + val : 'Client: All';
        $('website-label').textContent = 'Website: All';
        buildWebsiteMenu(val);
        renderTable();
      } else if (filterType === 'website') {
        F.website = val;
        $('website-label').textContent = val ? 'Website: ' + val : 'Website: All';
        renderTable();
      } else if (filterType === 'sev') {
        F.severity = val;
        $('sev-label').textContent = val ? 'Severity: ' + (val === 'action-required' ? 'Action Required' : val === 'review-recommended' ? 'Review Recommended' : 'Information') : 'Severity: All';
        renderTable();
      } else if (filterType === 'status') {
        F.status = val;
        $('status-label').textContent = val ? 'Status: ' + statusLabel(val) : 'Status: All';
        renderTable();
      }

      /* date picker */
      var ddTarget = item.getAttribute('data-dd-target');
      if (ddTarget) {
        var lbl = $(ddTarget);
        if (lbl) lbl.textContent = item.getAttribute('data-val') || lbl.textContent;
      }

      /* set-status from detail */
      var statusVal = item.getAttribute('data-status');
      if (statusVal && currentIssue) {
        currentIssue.status = statusVal;
        $('current-status-display').innerHTML = statusBadge(statusVal);
        var mrbtnD = $('mark-resolved-btn');
        if (mrbtnD) mrbtnD.style.display = statusVal === 'resolved' ? 'none' : '';
        toast('Status updated to ' + statusLabel(statusVal));
      }
    });

    /* Mark as resolved */
    var mrbtn = $('mark-resolved-btn');
    if (mrbtn) mrbtn.addEventListener('click', function () {
      var modal = $('resolve-modal');
      if (modal) modal.style.display = 'flex';
    });
    var cancelBtn = $('modal-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', function () {
      $('resolve-modal').style.display = 'none';
    });
    var confirmBtn = $('modal-confirm');
    if (confirmBtn) confirmBtn.addEventListener('click', function () {
      if (currentIssue) {
        currentIssue.status = 'resolved';
        $('current-status-display').innerHTML = statusBadge('resolved');
      }
      $('resolve-modal').style.display = 'none';
      $('resolve-note').value = '';
      toast('Issue marked as resolved');
    });

    /* Search */
    var searchInput = $('issue-search');
    if (searchInput) searchInput.addEventListener('input', function () {
      F.search = this.value;
      renderTable();
    });
  }

  /* ── init ── */
  buildClientMenu();
  buildWebsiteMenu('');
  renderTable();
  initSidebar();
  initEvents();

})();

