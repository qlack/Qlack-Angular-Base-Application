import {Component, OnInit} from "@angular/core";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {FormsService} from "./forms.service";
import {QFormsService} from "@qlack/forms";
import {UtilityService} from "../shared/service/utility.service";
import {QFormValidationService} from "@qlack/form-validation";
import {FormDto} from "../dto/form-dto";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"]
})
export class FormComponent implements OnInit {
  form!: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, private formsService: FormsService,
              private qForms: QFormsService, private utilityService: UtilityService,
              private qFormValidationService: QFormValidationService) {
  }

  ngOnInit(): void {
    // Set up the form.
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      age: ["", [Validators.required]]
    });
  }

  save() {
    this.formsService.save(
      this.qForms.cleanupData(this.form.getRawValue()) as FormDto).subscribe(
        onNext => {
          this.utilityService.popupSuccess("Form successfully saved.");
        },
        onError => {
          if (onError.status == 400) {
            const validationErrors = onError.error;
            if (validationErrors) {
              this.utilityService.popupError("Form could not be saved.");
              // @ts-ignore
              this.qFormValidationService.validateForm(this.form, validationErrors);
            }
          }
        }
      );
  }

}
