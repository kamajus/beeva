import { FileObject } from '@supabase/storage-js/src/lib/types';

import { Database } from './supabase';

export type ResidenceTypes = 'apartment' | 'land' | 'others' | 'villa' | 'all';
export type Residence = Database['public']['Tables']['residences']['Row'];
export type User = Database['public']['Tables']['users']['Row'];

type WithoutPrice<T> = {
  [K in Exclude<keyof T, 'price'>]: T[K];
};

export interface ResidenceCard extends WithoutPrice<Residence> {
  price: string | null;
}

export interface ResidenceBase {
  id?: number;
  location: string;
  status: 'sell' | 'rent';
  cover: string;
  type?: ResidenceTypes;
}

export interface ResidenceQuery {
  id: string;
  owner_id: string;
  location: string;
  status: 'sell' | 'rent';
  cover: string;
  price: number;
  type: ResidenceTypes;
  description: string;
  created_at: Date;
}

export interface ResidenceProps extends ResidenceBase {
  price: number;
  description?: string;
}

export interface ResidencePropsCard extends ResidenceBase {
  price: string;
}

export interface NewFileObject extends FileObject {
  public_url: string;
}
