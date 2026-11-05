# Qicable additional languages

The fourteen dictionaries map exact approved English source strings to translated display text. The original six dictionaries remain in the existing UI modules. `client-source.json` bounds the current-locale text passed to interactive components; the other thirteen language corpora are kept out of browser JavaScript.

Generated with the site's configured DeepSeek translation model on 2026-11-04. Model identifiers, technical values, unit magnitudes, addresses, links and source media identities remain grounded in approved English material. Technical fact checks cover every dictionary entry; these checks do not certify native editorial quality.

`content/native-i18n-preview.json` is the reviewed-source preview plus 178 new article-language variants (240 article documents total). It is a staging input, not a production approval journal. Agent publication must use its normal revision/approval/release services. Future product facts stay in the single shared product record; new marketing wording may require corresponding dictionary updates.

Verification: `node --import tsx scripts/check-locales.ts`; build with `QICABLE_CONTENT_SNAPSHOT` pointing to the absolute staging snapshot and `QICABLE_NATIVE_MEDIA_ROOT` to approved media.
