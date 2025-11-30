package com.roompilot.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Employment status options for resident profiles. Used during profile completion to capture
 * employment information which hosts can review when evaluating rental applications.
 */
@Getter
@RequiredArgsConstructor
public enum EmploymentStatus {
  EMPLOYED("Full-time Employed", "Working full-time for an employer"),
  SELF_EMPLOYED("Self-Employed", "Running own business or freelancing"),
  PART_TIME("Part-time Employed", "Working part-time hours"),
  CONTRACTOR("Contractor/Gig Worker", "Contract work, gig economy"),
  STUDENT("Student", "Currently enrolled in education"),
  RETIRED("Retired", "No longer working by choice"),
  DISABLED("Receiving Disability", "Receiving disability benefits"),
  UNEMPLOYED("Currently Unemployed", "Seeking employment"),
  OTHER("Other", "Doesn't fit above categories");

  private final String displayLabel;
  private final String description;
}
