export type Page = {
  page_name: string;
  route: string;
};

export type SubModule = {
  submodule: string;
  pages: Page[];
};

export type Module = {
  module: string;
  submodules: SubModule[];
};