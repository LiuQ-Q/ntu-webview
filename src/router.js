import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import LogIn from './components/pages/LogIn.vue';
import Home from './components/pages/workbench.vue';

import DashBoard from './components/pages/workbench/DashBoard.vue';
import Projects from './components/pages/workbench/Projects.vue';
import Libraries from './components/pages/workbench/Libraries.vue';
import Vulnerabilities from './components/pages/workbench/Vulnerabilities.vue'
import Licenses from './components/pages/workbench/Licenses.vue';
import Settings from './components/pages/workbench/Settings.vue';
import CreateOrg from './components/pages/workbench/CreateOrg.vue';

import ProjectManage from './components/pages/workbench/ProjectsManage.vue';
import ProjectDetail from './components/pages/workbench/ProjectDetail.vue';
import ProjectCompare from './components/pages/workbench/ProjectsCompare.vue'
import LibraryResult from './components/pages/workbench/LibraryResult.vue';
import LibraryDetail from './components/pages/workbench/LibraryDetail.vue';
import VulnerabilityResult from './components/pages/workbench/VulnerabilityResult.vue';
import VulnerabilityDetail from './components/pages/workbench/VulnerabilityDetail.vue';
import LicenseResult from './components/pages/workbench/LicenseResult.vue';
import LicenseDetail from './components/pages/workbench/LicenseDetail.vue';

import Organizations from './components/pages/workbench/settings/Organizations.vue';
import Teams from './components/pages/workbench/settings/Teams.vue';
import TeamDetail from './components/pages/workbench/settings/TeamDetail.vue';
import Members from './components/pages/workbench/settings/Members.vue';
import Integration from './components/pages/workbench/settings/Integration.vue';
import AccessTokens from './components/pages/workbench/settings/AccessTokens.vue';

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: LogIn
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/',
          redirect: '/dashboard'
        },
        {
          path: '/dashboard',
          component: DashBoard
        },
        {
          path: '/projects',
          component: Projects
        },
        {
          path: '/libraries',
          component: Libraries
        },
        {
          path: '/vulnerabilities',
          component: Vulnerabilities
        },
        {
          path: '/licenses',
          component: Licenses
        },
        {
          path: '/manage',
          component: ProjectManage
        },
        {
          path: '/settings',
          component: Settings,
          children: [
            {
              path: '/',
              redirect: '/settings/organizations'
            },
            {
              path: '/settings/organizations',
              component: Organizations
            },
            {
              path: '/settings/teams',
              component: Teams
            },
            {
              path: '/settings/teams/:teamId',
              component: TeamDetail
            },
            {
              path: '/settings/members',
              component: Members
            },
            {
              path: '/settings/integration',
              component: Integration
            },
            {
              path: '/settings/accesstokens',
              component: AccessTokens
            },
          ]
        },
        {
          path: '/createorg',
          component: CreateOrg
        },
        {
          path: '/projects/:projectId',
          component: ProjectDetail
        },
        {
          path: '/projects/:projectId/compare',
          component: ProjectCompare
        },
        {
          path: '/projects/:projectId/libraries/:libraryId',
          component: LibraryResult
        },
        {
          path: '/projects/:projectId/libraries/:libraryId/issue/:issueId',
          component: LibraryDetail
        },
        {
          path: '/projects/:projectId/vulnerabilities/:vulnerabilityId',
          component: VulnerabilityResult
        },
        {
          path: '/projects/:projectId/vulnerabilities/:vulnerabilityId/issue/:issueId',
          component: VulnerabilityDetail
        },
        {
          path: '/projects/:projectId/licenses/:licenseId',
          component: LicenseResult
        },
        {
          path: '/projects/:projectId/licenses/:licenseId/issue/:issueId',
          component: LicenseDetail
        },
      ]
    }
  ]
});