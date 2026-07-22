# Blood Pressure Monitor Image Recognition Plan

## Implementation Update

The web implementation now uses the pretrained BPimageTranscribe model from
Kulkarni et al. entirely in the browser. The original Keras H5 weights are
converted to TensorFlow.js Layers format and shipped under
`public/models/bp-reader/`. Image preprocessing and model inference live in
`src/client/vision/`; selected photos are not uploaded.

The published model was trained on systolic and diastolic rows. For monitors
with one tall combined LCD, the app also isolates pulse and reuses the digit
model experimentally with a lower confidence threshold and an explicit review
warning.
Pulse remains manual. The existing server provider and scan endpoint are kept
as an unused extension point, rather than being part of the active photo flow.

## Objective

Allow a signed-in user to take or select a photo of a blood pressure monitor, extract the systolic, diastolic, and pulse values, and review those values in the existing measurement form before saving.

Image recognition is an assisted data-entry feature. An extracted reading must never be saved automatically, and the user must always confirm or correct the values first.

## Product Decisions

- Implement the first version in the responsive web application.
- Use the device's rear camera when the browser supports it and retain ordinary image selection as a fallback.
- Run the open-source BPimageTranscribe model locally with TensorFlow.js.
- Keep browser vision code behind a client adapter so the model can be replaced.
- Process images transiently on-device and never upload or persist them.
- Reuse the existing measurement form, validation, and save path.
- Consider a native mobile client later if on-device recognition, offline use, HealthKit or Health Connect, Bluetooth monitors, or more reliable notifications justify it.

## User Flow

1. The user opens the new-measurement dialog.
2. The user chooses **Scan monitor**.
3. The browser opens the rear camera where supported:

   ```html
   <input
     type="file"
     accept="image/jpeg,image/png,image/webp"
     capture="environment"
   />
   ```

4. The application shows a photo preview and allows the user to retake or replace it.
5. The client corrects image orientation and reproduces the paper's image preprocessing pipeline.
6. The local TensorFlow.js model returns candidate values and confidence information.
7. The application prefills the existing measurement form.
8. Fields with uncertain or invalid results are highlighted.
9. The user compares the values with the photo, corrects them if necessary, and explicitly submits the existing form.

## Proposed Structure

```text
src/
|-- core/measurements/
|   `-- extractedReading.ts
|-- client/components/
|   `-- MeasurementPhotoCapture.tsx
|-- client/vision/
|   |-- bpImagePreprocessing.ts
|   `-- bpMonitorReader.ts
|-- server/measurements/
|   `-- extractMeasurement.ts
|-- server/vision/
|   `-- monitorReadingProvider.ts
`-- web/routes/api/
    `-- measurement-scan.ts
```

### Domain core

Add pure types and validation to `src/core/measurements/extractedReading.ts`:

- A structured extracted-reading schema.
- Optional per-field confidence values.
- Plausibility validation using the same numerical limits as measurement entry.
- A check that systolic is greater than diastolic.
- A representation for missing or uncertain fields.

The domain code must not depend on image libraries, HTTP, React, or a vision provider.

Example provider-neutral result:

```ts
interface ExtractedReading {
  systolic: number | null;
  diastolic: number | null;
  pulse: number | null;
  confidence: {
    systolic: number | null;
    diastolic: number | null;
    pulse: number | null;
  };
  warnings: string[];
}
```

### Legacy server extension point

`src/server/measurements/extractMeasurement.ts` and the scan API remain as
provider-neutral extension points, but the active browser flow does not call
them or transmit image bytes.

They can still:

- Accept a validated image from the delivery adapter.
- Call the configured monitor-reading provider.
- Parse the provider response into the domain result.
- Reject malformed provider output.
- Run domain plausibility checks.
- Return candidates and warnings without saving a measurement.

### Browser vision adapter

The active implementation under `src/client/vision`:

- Normalizes the selected photo to the paper's 480 by 640 working size.
- Reproduces grayscale, bilateral filtering, gamma adjustment, adaptive
  thresholding, erosion/inversion, LCD localization, and row extraction.
- Loads the converted model lazily with TensorFlow.js.
- Reads systolic and diastolic, and experimentally reads pulse from either a
  tall combined LCD or a separate wide pulse display below the main BP screen.
- Returns `null` rather than using a low-confidence or malformed prediction.
- Maps the result back into the provider-neutral core schema.

### Optional web delivery adapter

The existing authenticated multipart endpoint at
`src/web/routes/api/measurement-scan.ts` is not called by the local reader. It
is retained only as an extension point for a future server-side provider.

It should:

- Require an authenticated user.
- Accept exactly one image.
- Validate MIME type using both declared type and file contents where practical.
- Enforce upload and decoded-image size limits.
- Call the server extraction use case.
- Translate expected failures into safe HTTP responses.
- Avoid logging image data or extracted health values.

The route must not contain OCR parsing or measurement business rules.

### Client experience

Add `MeasurementPhotoCapture` and integrate it into the new-measurement state of `MeasurementDialog`.

Required states:

- Initial camera/select-photo action.
- Local image preview.
- Processing.
- Extraction completed.
- Partial or uncertain extraction.
- Unsupported image or upload failure.
- Retake/replace photo.

When extraction succeeds:

- Populate only fields for which a candidate exists.
- Do not overwrite values that the user edited after extraction began.
- Visually identify fields that require checking.
- Keep all values editable.
- Keep the existing explicit **Add measurement** submission.
- Do not attach the image to the saved measurement.

## Image Handling

Perform safe client-side preparation where browser support permits:

- Respect EXIF orientation.
- Resize while retaining enough detail for display digits.
- Use a compressed web-friendly format.
- Avoid repeatedly recompressing the image.
- Show framing guidance so the monitor display fills most of the photo.

Safeguards for the optional server endpoint:

- Limit encoded upload size.
- Limit decoded dimensions and total pixels.
- Reject unsupported or malformed images.
- Apply a short processing timeout.
- Discard image bytes after the request completes.
- Strip metadata before forwarding the image if the chosen integration does not already do so.

## Confidence and Validation Policy

Confidence values are provider hints, not proof of correctness. The UI policy should be calibrated using the evaluation set rather than hard-coded from intuition.

Initial behavior:

- High confidence and plausible: prefill normally.
- Medium confidence: prefill and highlight the field for review.
- Low confidence: leave the field blank and ask for manual entry.
- Invalid combination or missing required field: retain usable candidates, identify the problem, and require manual completion.
- Never invent, interpolate, or autocorrect a digit.

The existing `measurementInputSchema` remains the final validation boundary when the user saves. OCR-specific validation supplements it but does not create a second persistence path.

## Privacy and Security

Monitor photos and extracted readings are health-related data. The first version should minimize collection:

- Do not store, upload, log, or analyze the selected image outside the local
  browser reader.
- Do not put image data in application logs, analytics, or error reports.
- Do not log extracted values unless an explicitly approved operational need exists.
- Authenticate and rate-limit the scan endpoint.
- Keep the local model assets versioned and document their source and license.
- Document the image-processing behavior in the privacy policy before release.
- Return generic client errors and keep provider internals out of responses.

## Evaluation Plan

Build a labelled set of approximately 100 to 200 consented test images before enabling the feature broadly.

Include:

- Multiple monitor manufacturers and display layouts.
- LCD and LED displays.
- Three-digit systolic readings.
- Missing pulse values.
- Memory, average, date, time, and error indicators.
- Glare, reflections, shadows, blur, low light, and tilted photos.
- Cropped and distant displays.
- Plausible and intentionally unusual readings within the application's accepted ranges.

Track accuracy separately for:

- Systolic extraction.
- Diastolic extraction.
- Pulse extraction.
- Correct label-to-value assignment.
- Appropriate refusal when a value is unreadable.
- Complete-reading accuracy.

Do not use real user photos for continuing evaluation without explicit consent and a defined retention policy.

## Testing

### Unit tests

- Structured provider output parsing.
- Missing and uncertain fields.
- Numerical boundary validation.
- Systolic/diastolic relationship checking.
- Warning generation.
- Provider error mapping.

### Integration tests

- Authentication is required for scanning.
- Valid image upload produces a structured result.
- Unsupported types and oversized images are rejected.
- Provider timeouts and malformed responses are handled safely.
- Extraction never inserts or updates a database measurement.

### Client tests

- Successful extraction prefills the correct fields.
- Partial results preserve blank fields.
- User edits made during processing are not overwritten.
- Retake and error recovery work.
- Measurement submission still uses the existing save path.

### Manual verification

- iOS Safari camera and photo-library flow.
- Android Chrome camera and photo-library flow.
- Desktop file selection fallback.
- Keyboard and screen-reader operation.
- Slow network and provider failure states.

## Delivery Phases

### Phase 1: Technical spike (completed)

- Evaluate and select the published BPimageTranscribe model.
- Create the provider-neutral extraction schema.
- Test a small, representative set of monitor photos outside the UI.
- Confirm that structured output reliably distinguishes SYS, DIA, and PULSE.
- Establish initial size, timeout, and confidence policies.

Exit criterion: the model demonstrates sufficient accuracy to justify product integration and fails safely on unreadable images.

### Phase 2: Web MVP

- Implement the core extraction types and rules.
- Convert and bundle the published Keras model for TensorFlow.js.
- Implement the local browser preprocessing and inference adapter.
- Add camera/photo selection and preview.
- Prefill the existing measurement dialog with mandatory review.
- Add unit, integration, and client tests.
- Confirm that selected images remain in the browser and are not persisted or logged.

Exit criterion: a user can scan, review, correct, and save a reading on mobile web, with manual entry always available.

### Phase 3: Calibration and rollout

- Assemble the labelled evaluation set.
- Measure per-field and complete-reading accuracy.
- Tune prompts, preprocessing, confidence thresholds, and capture guidance.
- Add rate limiting and operational metrics that do not expose health data.
- Release behind a feature flag or to a limited cohort.

Exit criterion: agreed accuracy and safe-refusal thresholds are met across supported monitor categories.

### Phase 4: Mobile decision

Evaluate a native client only after learning from web usage. Native development is justified if the product needs one or more of:

- On-device OCR and offline scanning.
- Live camera framing or automatic capture.
- HealthKit or Health Connect integration.
- Bluetooth monitor integration.
- More reliable background reminders.
- Offline measurement entry and synchronization.

Keep domain rules and server use cases reusable. A native client should replace delivery, camera, and OCR adapters rather than duplicate measurement rules.

## Definition of Done for the Web MVP

- A signed-in user can take or select a monitor photo on mobile web.
- Invalid and oversized selections are rejected safely.
- The browser adapter returns a provider-neutral structured result.
- Candidate values appear in the existing measurement form.
- Missing or uncertain values require user attention.
- The user can edit every extracted value.
- No OCR result is automatically saved.
- Saving uses the existing measurement schema and server use case.
- Image bytes remain transient and are discarded after processing.
- Automated tests cover domain parsing, endpoint boundaries, and client prefilling.
- The flow is manually verified on iOS Safari, Android Chrome, and desktop.
- Local model licensing and image privacy behavior are documented before production release.
