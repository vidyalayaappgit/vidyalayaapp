export interface Page {
  page_id: number;
  page_name: string;
  route: string;   // ✅ FIX (was path)
}

export interface SubModule {
  submodule: string;  // ✅ FIX
  pages: Page[] | null;
}

export interface Module {
  module: string;     // ✅ FIX
  submodules: SubModule[];
}