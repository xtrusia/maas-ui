import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import type { ScriptResults } from "app/store/scriptresults/types";
import type { TSFixMe } from "app/base/types";

/**
 * Returns list of all script results.
 * @param {RootState} state - Redux state
 * @returns {ScriptResults} Script results
 */
const all = (state: RootState): ScriptResults => state.scriptresults.items;

/**
 * Returns true if script results are loading
 * @param {RootState} state - Redux state
 * @returns {ScriptResultsState["loading"]} Scripts results are loading
 */

const loading = (state: RootState): boolean => state.scriptresults.loading;

/**
 * Returns true if script results have loaded
 * @param {RootState} state - Redux state
 * @returns {ScriptResultsState["loaded"]} Scripts results have loaded
 */
const loaded = (state: RootState): boolean => state.scriptresults.loaded;

/**
 * Returns true if script results have saved
 * @param {RootState} state - Redux state
 * @returns {ScriptResultsState["saved"]} Scripts results have saved
 */
const saved = (state: RootState): boolean => state.scriptresults.saved;

/**
 * Returns script result errors.
 * @param {RootState} state - The redux state.
 * @returns {ScriptResultsState["errors"]} Errors for a script result.
 */
const errors = (state: RootState): TSFixMe => state.scriptresults.errors;

/**
 * Returns true if script results have errors
 * @param {RootState} state - Redux state
 * @returns {Boolean} Script results have errors
 */
const hasErrors = createSelector(
  [errors],
  (errors) => Object.entries(errors).length > 0
);

const scriptresults = {
  all,
  errors,
  hasErrors,
  loaded,
  loading,
  saved,
};

export default scriptresults;
