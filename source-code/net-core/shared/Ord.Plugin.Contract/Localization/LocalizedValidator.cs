using FluentValidation;
using Microsoft.Extensions.Localization;
using Ord.Plugin.Contract.Factories;
using System;
using System.Linq.Expressions;
using Volo.Abp.DependencyInjection;

namespace Ord;
public abstract class LocalizedValidator<TModel, TResource> : AbstractValidator<TModel>, ITransientDependency
    where TResource : class
{
    protected readonly IAppFactory AppFactory;

    public LocalizedValidator(IAppFactory appFactory)
    {
        AppFactory = appFactory;
    }

    protected IStringLocalizer<TResource> L =>
        AppFactory.GetServiceDependency<IStringLocalizer<TResource>>();

    protected string GetLocalizedMessage(string key, params object[] formatArgs)
    {
        return formatArgs?.Length > 0
            ? L[key, formatArgs].Value
            : L[key].Value;
    }

    #region String Validation Methods

    protected void ValidateRequiredString(
        Expression<Func<TModel, string>> property,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .Must(value => !string.IsNullOrEmpty(value) && !string.IsNullOrWhiteSpace(value))
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    protected void ValidateMinLength(
        Expression<Func<TModel, string>> property,
        int minLength,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .MinimumLength(minLength)
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    protected void ValidateMaxLength(
        Expression<Func<TModel, string>> property,
        int maxLength,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .MaximumLength(maxLength)
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    protected void ValidateLengthRange(
        Expression<Func<TModel, string>> property,
        int minLength,
        int maxLength,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .Length(minLength, maxLength)
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    protected void ValidateEmail(
        Expression<Func<TModel, string>> property,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .EmailAddress()
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }
    protected void ValidatePhoneNumber(
        Expression<Func<TModel, string>> property,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .Matches(@"^[\+]?[0-9\s\-\(\)]+$")
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    protected void ValidateUrl(
        Expression<Func<TModel, string>> property,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .Must(url => Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    protected void ValidateRegex(
        Expression<Func<TModel, string>> property,
        string pattern,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .Matches(pattern)
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }
    protected void ValidateRegexIfNotNull(
        Expression<Func<TModel, string>> property,
        string pattern,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .Matches(pattern)
            .When(x => !string.IsNullOrWhiteSpace(GetPropertyValue(property, x)))
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }


    #endregion

    #region Numeric Validation Methods

    protected void ValidateRange<TValue>(
        Expression<Func<TModel, TValue>> property,
        TValue min,
        TValue max,
        string localizationKey,
        params object[] formatArgs)
        where TValue : IComparable<TValue>, IComparable
    {
        RuleFor(property)
            .InclusiveBetween(min, max)
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    protected void ValidateMinValue<TValue>(
        Expression<Func<TModel, TValue>> property,
        TValue minValue,
        string localizationKey,
        params object[] formatArgs)
        where TValue : IComparable<TValue>, IComparable
    {
        RuleFor(property)
            .GreaterThanOrEqualTo(minValue)
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    protected void ValidateMaxValue<TValue>(
        Expression<Func<TModel, TValue>> property,
        TValue maxValue,
        string localizationKey,
        params object[] formatArgs)
        where TValue : IComparable<TValue>, IComparable
    {
        RuleFor(property)
            .LessThanOrEqualTo(maxValue)
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    protected void ValidatePositive<TValue>(
        Expression<Func<TModel, TValue>> property,
        string localizationKey,
        params object[] formatArgs)
        where TValue : IComparable<TValue>, IComparable
    {
        RuleFor(property)
            .GreaterThan(default(TValue))
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    #endregion

    #region Collection Validation Methods

    protected void ValidateCollectionNotEmpty<TItem>(
        Expression<Func<TModel, IEnumerable<TItem>>> property,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .NotEmpty()
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    protected void ValidateCollectionMinCount<TItem>(
        Expression<Func<TModel, IEnumerable<TItem>>> property,
        int minCount,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .Must(collection => collection?.Count() >= minCount)
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    protected void ValidateCollectionMaxCount<TItem>(
        Expression<Func<TModel, IEnumerable<TItem>>> property,
        int maxCount,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .Must(collection => collection?.Count() <= maxCount)
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    #endregion

    #region Date Validation Methods

    protected void ValidateDateRange(
        Expression<Func<TModel, DateTime>> property,
        DateTime minDate,
        DateTime maxDate,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .InclusiveBetween(minDate, maxDate)
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    protected void ValidateFutureDate(
        Expression<Func<TModel, DateTime>> property,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .GreaterThan(DateTime.Now)
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    protected void ValidatePastDate(
        Expression<Func<TModel, DateTime>> property,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .LessThan(DateTime.Now)
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    protected void ValidateAge(
        Expression<Func<TModel, DateTime>> property,
        int minAge,
        int maxAge,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .Must(birthDate =>
            {
                var age = DateTime.Now.Year - birthDate.Year;
                if (DateTime.Now.DayOfYear < birthDate.DayOfYear)
                    age--;
                return age >= minAge && age <= maxAge;
            })
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    #endregion

    #region Custom Validation Methods

    protected void ValidateCustom<TProperty>(
        Expression<Func<TModel, TProperty>> property,
        Func<TProperty, bool> predicate,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .Must(predicate)
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    protected void ValidateCustomAsync<TProperty>(
        Expression<Func<TModel, TProperty>> property,
        Func<TProperty, Task<bool>> predicate,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .MustAsync(async (value, cancellation) => await predicate(value))
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }
    protected void ValidateBlacklist(
        Expression<Func<TModel, string>> property,
        Func<Task<List<string>>> getBlacklistAsync,
        string localizationKey,
        params object[] formatArgs)
    {
        RuleFor(property)
            .MustAsync(async (value, cancellation) =>
            {
                if (string.IsNullOrWhiteSpace(value))
                    return true;

                var blacklist = await getBlacklistAsync();
                return !blacklist.Contains(value, StringComparer.OrdinalIgnoreCase);
            })
            .WithErrorCode(localizationKey)
            .WithMessage(GetLocalizedMessage(localizationKey, formatArgs));
    }

    #endregion

    private static string GetPropertyValue(Expression<Func<TModel, string>> property, TModel model)
    {
        try
        {
            return property.Compile().Invoke(model);
        }
        catch
        {
            return null;
        }
    }
}