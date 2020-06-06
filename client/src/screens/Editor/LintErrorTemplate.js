import React  from 'react';

export default function LintErrorTemplate({
  line,
  type,
  column,
  ruleId,
  message,
}) {
  return (
    <div className={`lint-${type}`}>{`${type.toUpperCase()}: ${message} @ ${line}:${column}`}</div>
  )
}

