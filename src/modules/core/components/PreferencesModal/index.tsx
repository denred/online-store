import React, { useCallback, useState, FormEvent, useMemo, FC } from 'react';
import { SingleValue } from 'react-select';
import CountrySelect, {
  SelectOptionProps,
} from 'modules/core/components/CountrySelect';
import { countries } from './listOfCountries';
import LanguageSelect from 'modules/core/components/LanguageSelect';
import Copyright from 'modules/core/components/Copyright';
import { Language } from 'types/types';
import styles from './index.module.scss';
import { useTranslation } from 'react-i18next';

export interface PreferencesModalProps {
  showModal: boolean;
  hideModal: () => void;
}

const PreferencesModal: FC<PreferencesModalProps> = ({
  showModal,
  hideModal,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<
    SelectOptionProps | undefined
  >();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    Language.English,
  );
  const [showAlert, setShowAlert] = useState(false);

  const { t } = useTranslation();

  const selectorWrapperClassName = useMemo(
    () => (showAlert ? styles.selectorWrapperAlert : styles.selectorWrapper),
    [showAlert],
  );

  const handleCountryChange = useCallback(
    (newValue: SingleValue<SelectOptionProps | undefined>) => {
      const country = newValue as SelectOptionProps;
      setShowAlert(false);
      setSelectedCountry(country);
    },
    [setShowAlert, setSelectedCountry],
  );

  const handleLanguageChange = useCallback(
    (language: Language) => () => setSelectedLanguage(language),
    [setSelectedLanguage],
  );

  const languageButtonClassName = useCallback(
    (language: string) =>
      language === selectedLanguage ? styles.focus : styles.languageButton,
    [selectedLanguage],
  );

  const saveCountryLanguage = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const isCheckboxChecked = (event.target as HTMLFormElement).check.checked;

      if (!showModal) return null;

      if (selectedCountry) {
        try {
          const serializedCountry = JSON.stringify(selectedCountry.label);
          const serializedLanguage = JSON.stringify(selectedLanguage);
          localStorage.setItem('country', serializedCountry);
          localStorage.setItem('language', serializedLanguage);
          hideModal();
          if (isCheckboxChecked) {
            localStorage.setItem('shouldShowModal', 'false');
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        setShowAlert(true);
      }
    },
    [],
  );

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.modalBox}>
          <div className={styles.locationWrapper}>
            <p className={styles.locationText}>
              {t('homePageModal.selectLocation')}
            </p>
            <div className={selectorWrapperClassName}>
              <CountrySelect
                options={countries}
                value={selectedCountry}
                onChange={handleCountryChange}
              />
            </div>
          </div>
          <div className={styles.languageWrapper}>
            <p className={styles.languageText}>
              {' '}
              {t('homePageModal.selectLanguage')}
            </p>
            <div className={styles.languageWrapper}>
              <LanguageSelect
                getButtonClassName={languageButtonClassName}
                handleLanguageChange={handleLanguageChange}
              />
            </div>
            {/* TODO: move to a separate component */}
            <div className={styles.assentWrapper}>
              <form className={styles.agreement} onSubmit={saveCountryLanguage}>
                <label>
                  <input
                    type="checkbox"
                    name="check"
                    className={styles.checkbox}
                  />
                  <span className={styles.agreementText}>
                    {t('homePageModal.rememberSelection')}
                  </span>
                </label>
                <button className={styles.assentButton} type="submit">
                  {t('homePageModal.go')}!
                </button>
              </form>
            </div>
          </div>
        </div>
        <div>
          <Copyright />
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;