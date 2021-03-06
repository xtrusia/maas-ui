import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { machine as machineActions } from "app/base/actions";
import machineSelectors from "app/store/machine/selectors";
import ActionForm from "app/base/components/ActionForm";
import TagFormFields from "./TagFormFields";

const TagFormSchema = Yup.object().shape({
  tags: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        displayName: Yup.string(),
      })
    )
    .min(1)
    .required("You must select at least one tag."),
});

export const TagForm = ({ setSelectedAction }) => {
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({ tags: [] });
  const selectedMachines = useSelector(machineSelectors.selected);
  const errors = useSelector(machineSelectors.errors);
  const taggingSelected = useSelector(machineSelectors.taggingSelected);

  const formErrors = { ...errors };
  if (formErrors && formErrors.name) {
    formErrors.tags = formErrors.name;
    delete formErrors.name;
  }

  return (
    <ActionForm
      actionName="tag"
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      errors={formErrors}
      initialValues={initialValues}
      modelName="machine"
      onSubmit={(values) => {
        if (values.tags && values.tags.length) {
          selectedMachines.forEach((machine) => {
            dispatch(machineActions.tag(machine.system_id, values.tags));
          });
        }
        setInitialValues(values);
      }}
      processingCount={taggingSelected.length}
      selectedCount={selectedMachines.length}
      validationSchema={TagFormSchema}
    >
      <TagFormFields />
    </ActionForm>
  );
};

TagForm.propTypes = {
  setSelectedAction: PropTypes.func.isRequired,
};

export default TagForm;
