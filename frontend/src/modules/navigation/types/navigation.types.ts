export interface Page {
  page_id: number;
  page_name: string;
  page_code: string;     // ✅ Add this
  route: string;
}

export interface SubModule {
  submodule: string;
  sub_module_code: string;
  pages: Page[] | null;
}

export interface Module {
  module: string;
  module_code: string;
  submodules: SubModule[];
}