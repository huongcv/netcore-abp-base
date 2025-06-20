import Utils from "@ord-core/utils/utils";
import {l} from "@ord-core/language/lang.utils";
import RegexUtil from "@ord-core/utils/regex.util";
import React from "react";
import dayjs from "dayjs";
import {NamePath} from "antd/es/form/interface";

class ValidateUtils {
  passwordSetting: any;

  timeIsAfterOrEqual(compareField: NamePath, labelKey?: string) {
    return (form: any) => ({
      validator(_: any, value: string) {
        const fromValue = form.getFieldValue(compareField);

        // Nếu không có 1 trong 2 giá trị thì skip
        if (!value || !fromValue) {
          return Promise.resolve();
        }

        const format = "HH:mm";
        const current = dayjs(value, format);
        const compare = dayjs(fromValue, format);
        if (current.isSame(compare) || current.isAfter(compare)) {
          return Promise.resolve();
        }

        return Promise.reject(
          new Error(l.transCommon("formInvalid.timeAfterOrEqual") as any)
        );
      },
    });
  }

  get required() {
    return (form: any) => ({
      validator(_: any, value: string) {
        if (!Utils.isEmptyOrWhiteSpace(value)) {
          return Promise.resolve();
        } else {
          const fieldName =
            form.getFieldInstance(_.field)?.nativeElement?.id || _.field;
          const fieldNameTrans =
            Utils.getTextLabel(fieldName) || l.transCommon("currentField");
          return Promise.reject(
            new Error(
              l.transCommon("formInvalid.emptyOrNull", {
                fieldName: fieldNameTrans,
              }) as any
            )
          );
        }
      },
    });
  }

  requiredWithText(fieldNameTranslate?: string) {
    return () => ({
      validator(_: any, value: string) {
        if (!Utils.isEmptyOrWhiteSpace(value)) {
          return Promise.resolve();
        } else {
          if (!fieldNameTranslate) {
            const fieldName = _.field;
            fieldNameTranslate = Utils.getTextLabel(fieldName);
          }

          return Promise.reject(
            new Error(
              l.transCommon("formInvalid.emptyOrNull", {
                fieldName: fieldNameTranslate || l.transCommon("currentField"),
              }) as any
            )
          );
        }
      },
    });
  }

  get requiredNoMess() {
    return () => ({
      validator(_: any, value: string) {
        if (!Utils.isEmptyOrWhiteSpace(value)) {
          return Promise.resolve();
        } else {
          return Promise.reject();
        }
      },
    });
  }

  get requiredShortMess() {
    return (form: any) => ({
      validator(_: any, value: string) {
        if (!Utils.isEmptyOrWhiteSpace(value)) {
          return Promise.resolve();
        } else {
          const fieldName =
            form.getFieldInstance(_.field)?.nativeElement?.id || _.field;
          const fieldNameTrans =
            Utils.getTextLabel(fieldName) || l.transCommon("currentField");

          return Promise.reject(
            new Error(
              l.transCommon("formInvalid.emptyOrNullShort", {
                fieldName: fieldNameTrans,
              }) as any
            )
          );
        }
      },
    });
  }

  requiredShortMessWithText(fieldNameTranslate?: string) {
    return () => ({
      validator(_: any, value: string) {
        if (!Utils.isEmptyOrWhiteSpace(value)) {
          return Promise.resolve();
        } else {
          if (!fieldNameTranslate) {
            const fieldName = _.field;
            fieldNameTranslate =
              Utils.getTextLabel(fieldName) || l.transCommon("currentField");
          }

          return Promise.reject(
            new Error(
              l.transCommon("formInvalid.emptyOrNullShort", {
                fieldName: fieldNameTranslate,
              }) as any
            )
          );
        }
      },
    });
  }

  get mustGreaterThanZero() {
    return (form: any) => ({
      validator(_: any, value: string) {
        const fieldName =
          form.getFieldInstance(_.field)?.nativeElement?.id || _.field;
        const fieldNameTrans =
          Utils.getTextLabel(fieldName) || l.transCommon("numberText");

        if (Utils.isEmptyOrWhiteSpace(value)) {
          return Promise.reject(
            new Error(
              l.transCommon("formInvalid.emptyOrNullShort", {
                fieldName: fieldNameTrans,
              }) as any
            )
          );
        }
        if (!Utils.isEmptyOrWhiteSpace(value)) {
          return Promise.resolve();
        }
        const v = +value;
        if (v > 0) {
          return Promise.resolve();
        }

        return Promise.reject(
          new Error(
            l.transCommon("formInvalid.mustGreaterThanZero", {
              fieldName: fieldNameTrans,
            }) as any
          )
        );
      },
    });
  }

  mustGreaterThanZeroWithText(fieldNameTranslate?: string) {
    return () => ({
      validator(_: any, value: string) {
        if (!fieldNameTranslate) {
          const fieldName = _.field;
          fieldNameTranslate =
            Utils.getTextLabel(fieldName) || l.transCommon("numberText");
        }

        if (Utils.isEmptyOrWhiteSpace(value)) {
          return Promise.reject(
            new Error(
              l.transCommon("formInvalid.emptyOrNullShort", {
                fieldName: fieldNameTranslate,
              }) as any
            )
          );
        }
        if (!Utils.isEmptyOrWhiteSpace(value)) {
          return Promise.resolve();
        }
        const v = +value;
        if (v > 0) {
          return Promise.resolve();
        }

        return Promise.reject(
          new Error(
            l.transCommon("formInvalid.mustGreaterThanZero", {
              fieldName: fieldNameTranslate,
            }) as any
          )
        );
      },
    });
  }

  get alwaysValid() {
    return () => ({
      validator(_: any) {
        return Promise.resolve();
      },
    });
  }

  get userName() {
    return this.validateByRegex(RegexUtil.UserName, "formInvalid.notUserName");
  }

  get userName2() {
    return this.validateByRegex(
      RegexUtil.UserName2,
      "formInvalid.notUserName2"
    );
  }

  get codeTenant() {
    return this.validateByRegex(
      RegexUtil.CodeTenantRegex,
      "formInvalid.notCodeTenant"
    );
  }

  get codeShop() {
    return this.validateByRegex(
      RegexUtil.CodeRegex,
      "formInvalid.notCodeTenant"
    );
  }

  get password() {
    if (!!this.passwordSetting) {
      return this.validateByRegex(
        this.buildPasswordRegex(this.passwordSetting),
        localStorage.getItem("passwordRegexDescription") ||
          "formInvalid.notPassword"
      );
    }
    return this.validateByRegex(RegexUtil.Password, "formInvalid.notPassword");
  }

  get email() {
    return this.validateByRegex(RegexUtil.Email, "formInvalid.notEmail");
  }

  get phoneNumberVietNam() {
    return this.validateByRegex(RegexUtil.PhoneVn, "formInvalid.notPhone");
  }

  get cccd() {
    return this.validateByRegex(RegexUtil.CCCD, "formInvalid.notCCCD");
  }

  get taxCode() {
    return this.validateByRegex(RegexUtil.TaxCode, "formInvalid.notTaxCode");
  }

  maxLength(max: number, label?: string) {
    return (form: any) => ({
      validator(_: any, value: string) {
        const trimValue = value?.trim();
        if (!trimValue || trimValue.length <= max) {
          return Promise.resolve();
        } else {
          const fieldName =
            form.getFieldInstance(_.field)?.nativeElement?.id || _.field;
          const fieldNameTrans =
            label ||
            Utils.getTextLabel(fieldName) ||
            l.transCommon("currentField");

          return Promise.reject(
            new Error(
              l.transCommon("formInvalid.maxLength", {
                max: max,
                fieldName: fieldNameTrans,
              }) as any
            )
          );
        }
      },
    });
  }

  maxLengthWithText(max: number, fieldNameTranslate: string) {
    return () => ({
      validator(_: any, value: string) {
        const trimValue = value?.trim();
        if (!trimValue || trimValue.length <= max) {
          return Promise.resolve();
        } else {
          if (!fieldNameTranslate) {
            const fieldName = _.field;
            fieldNameTranslate = Utils.getTextLabel(fieldName);
          }
          return Promise.reject(
            new Error(
              l.transCommon("formInvalid.maxLength", {
                max: max,
                fieldName: fieldNameTranslate || l.transCommon("currentField"),
              }) as any
            )
          );
        }
      },
    });
  }

  minLength(min: number) {
    return (form: any) => ({
      validator(_: any, value: string) {
        const trimValue = value?.trim();
        if (!trimValue || trimValue.length >= min) {
          return Promise.resolve();
        } else {
          const fieldName =
            form.getFieldInstance(_.field)?.nativeElement?.id || _.field;
          const fieldNameTrans =
            Utils.getTextLabel(fieldName) || l.transCommon("currentField");

          return Promise.reject(
            new Error(
              l.transCommon("formInvalid.minLength", {
                min: min,
                fieldName: fieldNameTrans,
              }) as any
            )
          );
        }
      },
    });
  }

  max(maxValue: number) {
    return (form: any) => ({
      validator(_: any, value: number) {
        if (value === undefined || value <= maxValue) {
          return Promise.resolve();
        } else {
          const fieldName =
            form.getFieldInstance(_.field)?.nativeElement?.id || _.field;
          const fieldNameTrans =
            Utils.getTextLabel(fieldName) || l.transCommon("numberText");

          return Promise.reject(
            new Error(
              l.transCommon("formInvalid.maxValue", {
                max: maxValue,
                fieldName: fieldNameTrans,
              }) as any
            )
          );
        }
      },
    });
  }

  min(minValue: number) {
    return (form: any) => ({
      validator(_: any, value: number) {
        if (value === undefined || value >= minValue) {
          return Promise.resolve();
        } else {
          const fieldName =
            form.getFieldInstance(_.field)?.nativeElement?.id || _.field;
          const fieldNameTrans =
            Utils.getTextLabel(fieldName) || l.transCommon("numberText");

          return Promise.reject(
            new Error(
              l.transCommon("formInvalid.minValue", {
                min: minValue,
                fieldName: fieldNameTrans,
              }) as any
            )
          );
        }
      },
    });
  }

  disableSpace(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
    }
  }

  private validateByRegex(reg: RegExp, error: string, label?: string) {
    return (form: any) => ({
      validator(_: any, value: string) {
        let trimValue = value?.trim();
        if (!Utils.isEmptyOrWhiteSpace(trimValue)) {
          if (!reg.test(trimValue)) {
            const fieldName =
              form.getFieldInstance(_.field)?.nativeElement?.id || _.field;
            const fieldNameTrans =
              label ||
              Utils.getTextLabel(fieldName) ||
              l.transCommon("currentField");

            return Promise.reject(
              new Error(
                l.transCommon(error, {
                  fieldName: fieldNameTrans,
                }) as any
              )
            );
          }
        }
        return Promise.resolve();
      },
    });
  }

  private buildPasswordRegex(settings: any) {
    let {
      minLength,
      maxLength,
      requireNumber,
      requireLowercase,
      requireUppercase,
      requireSpecialChar,
    } = settings;
    if (minLength >= maxLength) {
      maxLength = minLength + 30;
    }
    // Các phần của regex
    const conditions = [];
    if (requireNumber) conditions.push("(?=.*\\d)"); // Ít nhất một chữ số
    if (requireLowercase) conditions.push("(?=.*[a-z])"); // Ít nhất một chữ cái thường
    if (requireUppercase) conditions.push("(?=.*[A-Z])"); // Ít nhất một chữ cái hoa
    if (requireSpecialChar) conditions.push('(?=.*[!@#$%^&*(),.?":{}|<>])'); // Ít nhất một ký tự đặc biệt

    // Kết hợp tất cả điều kiện và độ dài
    const regexString = `^${conditions.join("")}.{${minLength},${maxLength}}$`;

    // Trả về đối tượng RegExp
    return new RegExp(regexString);
  }

  get alphaNumericRegex() {
    return this.validateByRegex(
      RegexUtil.AlphaNumeric,
      "formInvalid.alphaNumeric"
    );
  }

  get mustBeSmallerThan() {
    return (maxLength: number) => ({
      validator(_: any, value: string) {
        if (Utils.isEmptyOrWhiteSpace(value)) {
          return Promise.resolve();
        }

        if (value.length > maxLength) {
          const errorMessage = l.transCommon("formInvalid.tooLong", {
            maxLength,
          });
          return Promise.reject(new Error(errorMessage));
        }

        return Promise.resolve();
      },
    });
  }

  get mustBeGreaterThan() {
    return (minLength: number) => ({
      validator(_: any, value: string) {
        if (Utils.isEmptyOrWhiteSpace(value)) {
          return Promise.resolve();
        }

        if (value.length < minLength) {
          return Promise.reject(
            new Error(l.transCommon("formInvalid.tooShort") as any)
          );
        }

        return Promise.resolve();
      },
    });
  }

  get NoWhiteSpace() {
    return this.validateByRegex(
      RegexUtil.NoWhitespace,
      "formInvalid.noWhiteSpace"
    );
  }
  get NoCharacterAscii() {
    return this.validateByRegex(
      RegexUtil.NoSpecialAscii,
      "formInvalid.noCharacterAscii"
    );
  }

  filterGroupCode(value: string) {
    return Utils.toNonAccentVietnamese(value)
      .replace(/[^a-zA-Z0-9]/g, "") // Chỉ giữ lại chữ cái và số
      .toUpperCase(); // Chuyển thành chữ hoa
  }
  get NoSpecialCharacter() {
    return this.validateByRegex(
      RegexUtil.AlphaNumeric,
      "formInvalid.noCharacterAscii"
    );
  }
  get OnlyNumber() {
    return this.validateByRegex(RegexUtil.OnlyNumber, "formInvalid.OnlyNumber");
  }
}

export default new ValidateUtils();
