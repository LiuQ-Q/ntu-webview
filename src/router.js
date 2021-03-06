import Vue from 'vue';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import backend from './plugins/backend';

Vue.use(VueRouter);

import LogIn from './components/pages/LogIn.vue';
import Workbench from './components/pages/Workbench.vue';

import DashBoard from './components/pages/workbench/DashBoard.vue';
import Projects from './components/pages/workbench/Projects.vue';
import Libraries from './components/pages/workbench/Libraries.vue';
import Vulnerabilities from './components/pages/workbench/Vulnerabilities.vue'
import Licenses from './components/pages/workbench/Licenses.vue';
import RelationalTables from './components/pages/workbench/RelationalTables.vue'
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
import LicensePolicy from './components/pages/workbench/LicensePolicy.vue';

import Organizations from './components/pages/workbench/settings/Organizations.vue';
import Teams from './components/pages/workbench/settings/Teams.vue';
import TeamDetail from './components/pages/workbench/settings/TeamDetail.vue';
import Members from './components/pages/workbench/settings/Members.vue';
import Integration from './components/pages/workbench/settings/Integration.vue';
import AccessTokens from './components/pages/workbench/settings/AccessTokens.vue';

import UserSetting from './components/pages/workbench/UserSetting.vue';

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: LogIn
    },
    {
      path: '/workbench/:orgId',
      component: Workbench,
      children: [
        {
          path: 'dashboard',
          component: DashBoard
        },
        {
          path: 'projects',
          component: Projects
        },
        {
          path: 'libraries',
          component: Libraries
        },
        {
          path: 'vulnerabilities',
          component: Vulnerabilities
        },
        {
          path: 'licenses',
          component: Licenses
        },
        {
          path: 'relational-tables',
          component: RelationalTables
        },
        {
          path: 'manage',
          component: ProjectManage
        },
        {
          path: 'settings',
          component: Settings,
          children: [
            {
              path: '/',
              redirect: 'organizations'
            },
            {
              path: 'organizations',
              component: Organizations
            },
            {
              path: 'teams',
              component: Teams
            },
            {
              path: 'teams/:teamId',
              component: TeamDetail
            },
            {
              path: 'members',
              component: Members
            },
            {
              path: 'integration',
              component: Integration
            },
            {
              path: 'accesstokens',
              component: AccessTokens
            },
          ]
        },
        {
          path: 'createorg',
          component: CreateOrg
        },
        {
          path: 'projects/:projectId',
          component: ProjectDetail
        },
        {
          path: 'projects/:projectId/compare/:compareId',
          component: ProjectCompare
        },
        {
          path: 'projects/:projectId/libraries/:scanId',
          component: LibraryResult
        },
        {
          path: 'projects/:projectId/libraries/:scanId/issue/:issueId',
          component: LibraryDetail
        },
        {
          path: 'projects/:projectId/vulnerabilities/:scanId',
          component: VulnerabilityResult
        },
        {
          path: 'projects/:projectId/vulnerabilities/:scanId/issue/:issueId',
          component: VulnerabilityDetail
        },
        {
          path: 'projects/:projectId/licenses/:scanId',
          component: LicenseResult
        },
        {
          path: 'projects/:projectId/licenses/:scanId/issue/:issueId',
          component: LicenseDetail
        },
        {
          path: 'policies/:policyId',
          component: LicensePolicy
        },
        {
          path: 'user',
          component: UserSetting
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    if (Cookies.get('NTU_Token')) {
      backend.getOrgId().then(res => {
        next({ path: `/workbench/${res.results[0].id}/dashboard` })
      });
    }

    next();
  } else {
    Cookies.get('NTU_Token') ? next() : next({ path: '/login' });
  }
});

export default router;