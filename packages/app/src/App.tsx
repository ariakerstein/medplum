import { Space } from '@mantine/core';
import { MEDPLUM_VERSION, MedplumClient } from '@medplum/core';
import { UserConfiguration } from '@medplum/fhirtypes';
import { AppShell, Loading, Logo, NavbarMenu, useMedplum, MedplumProvider } from '@medplum/react';
import {
  IconBrandAsana,
  IconBuilding,
  IconForms,
  IconId,
  IconLock,
  IconLockAccess,
  IconMicroscope,
  IconPackages,
  IconReceipt,
  IconReportMedical,
  IconStar,
  IconWebhook,
} from '@tabler/icons-react';
import { FunctionComponent, Suspense, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';
import './App.css';

const medplumClient = new MedplumClient({
  baseUrl: import.meta.env.VITE_MEDPLUM_SERVER_URL,
  clientId: import.meta.env.VITE_MEDPLUM_CLIENT_ID,
  projectId: import.meta.env.VITE_MEDPLUM_PROJECT_ID,
});

export function App(): JSX.Element {
  return (
    <MedplumProvider medplum={medplumClient}>
      <AppContent />
    </MedplumProvider>
  );
}

function AppContent(): JSX.Element {
  const medplum = useMedplum();
  const [config, setConfig] = useState<UserConfiguration | undefined>(undefined);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initMedplum = async () => {
      try {
        await medplum.signIn();
        const userConfig = await medplum.getUserConfiguration();
        setConfig(userConfig);
      } catch (error) {
        console.error('Failed to initialize Medplum:', error);
      } finally {
        setLoading(false);
      }
    };

    initMedplum();
  }, [medplum]);

  if (loading) {
    return <Loading />;
  }

  return (
    <AppShell
      logo={<Logo size={24} />}
      pathname={location.pathname}
      searchParams={searchParams}
      version={MEDPLUM_VERSION}
      menus={userConfigToMenu(config)}
      displayAddBookmark={!!config?.id}
    >
      <Suspense fallback={<Loading />}>
        <AppRoutes />
      </Suspense>
    </AppShell>
  );
}

function userConfigToMenu(config: UserConfiguration | undefined): NavbarMenu[] {
  const result =
    config?.menu?.map((menu) => ({
      title: menu.title,
      links:
        menu.link?.map((link) => ({
          label: link.name,
          href: link.target as string,
          icon: getIcon(link.target as string),
        })) || [],
    })) || [];
  result.push({
    title: 'Settings',
    links: [
      {
        label: 'Security',
        href: '/security',
        icon: <IconLock />,
      },
    ],
  });
  return result;
}

const resourceTypeToIcon: Record<string, FunctionComponent> = {
  Patient: IconStar,
  Practitioner: IconId,
  Organization: IconBuilding,
  ServiceRequest: IconReceipt,
  DiagnosticReport: IconReportMedical,
  Questionnaire: IconForms,
  admin: IconBrandAsana,
  AccessPolicy: IconLockAccess,
  Subscription: IconWebhook,
  batch: IconPackages,
  Observation: IconMicroscope,
};

function getIcon(to: string): JSX.Element | undefined {
  try {
    const resourceType = new URL(to, 'https://app.medplum.com').pathname.split('/')[1];
    if (resourceType in resourceTypeToIcon) {
      const Icon = resourceTypeToIcon[resourceType];
      return <Icon />;
    }
  } catch (e) {
    // Ignore
  }
  return <Space w={30} />;
}