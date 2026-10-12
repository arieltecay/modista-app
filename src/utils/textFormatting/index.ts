/**
 * Barrel público. El import path histórico `utils/textFormatting` se mantiene
 * (carpeta + index), por lo que los consumidores legacy no requieren cambios.
 */
export { formatTextToHtml } from './parser';
export {
  SPEC_VERSION,
  GUIDE_ENTRIES,
  RICH_COLOR_CLASSES,
  RICH_FONT_CLASSES,
  BUTTON_VARIANT_CLASSES,
} from './syntax-spec';
export type { GuideEntry, RichColor, RichFont, ButtonVariant } from './syntax-spec';
