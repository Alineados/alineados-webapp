export interface ProblemCard {
  // ids
  id: string; // corresponds to primitive.ObjectID in Go
  uid: string; // user id
  pfid: string; // pillar info id
  cid: string; // category id

  // properties
  problem_name: string;
  category_name: string;
  pillar_name: string;
  milestone_date: Date;
  progress: number;
  active: boolean;
  security: boolean;

  // hidden properties
  is_new: boolean;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  completed_at?: string;
}