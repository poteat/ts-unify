import { $, isStringPredicate, regex } from '@ts-unify/core/internal'
import Pattern from '@ts-unify/engine/runtime/match/pattern'

import Fields from './fields'
import Proxies from './proxies'
import type { Plan } from './types'
import Values from './values'
/**
 * What a pattern value asks at a value position: a capture, a config
 * slot, a string predicate, a proxy, a fields record, or a literal.
 *
 * A proxy's or a record's plan is read once and kept for the lifetime of
 * the pattern object; an array is a fields record here.
 *
 * @param value the pattern value
 */
export const planOf = (value: unknown): Plan =>
  value === $
    ? Values.DOLLAR
    : Pattern.isCapture(value)
      ? { kind: 'capture', name: value.name }
      : Pattern.isConfigSlot(value)
        ? { kind: 'config', name: value.name }
        : isStringPredicate(value)
          ? {
              kind: 'string',
              test: value instanceof RegExp ? regex(value) : value,
            }
          : Pattern.isProxyNode(value)
            ? Proxies.proxyPlanOf(value)
            : typeof value === 'object' && value
              ? Fields.fieldsPlanOf(value)
              : { kind: 'literal', value }
