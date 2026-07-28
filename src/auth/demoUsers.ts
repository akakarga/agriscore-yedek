export type Role = 'institution' | 'producer';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  demoPassword?: string;
  role: Role;
  organizationName?: string;
  linkedProducerId?: string;
  demoLabel: string;
}

export const demoUsers: DemoUser[] = [
  {
    id: 'U_INST_01',
    name: 'AgriScore Kurumsal',
    email: 'kurum@agriscore.demo',
    demoPassword: 'Demo1234',
    role: 'institution',
    organizationName: 'Örnek Tarımsal Finans Kurumu',
    demoLabel: 'Kurumsal Çalışma Alanı'
  },
  {
    id: 'U_PROD_01',
    name: 'Ahmet Yılmaz',
    email: 'uretici@agriscore.demo',
    demoPassword: 'Demo1234',
    role: 'producer',
    linkedProducerId: 'P001',
    demoLabel: 'Üretici Çalışma Alanı'
  }
];
