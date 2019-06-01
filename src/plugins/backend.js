import axios from 'axios';
import Cookies from 'js-cookie';

function transformData(res) {
	return res.data;
}

const api = axios.create({
	baseURL: '/v1',
	headers: {}
});

function Options(options = {}) {
	if (!options.headers) {
		options.headers = {};
	}

	if (!options.params) {
		options.params = {};
	}

	options.headers.Authorization = `Token ${session.token}`;
	options.params._now = Date.now();

	return options;
}

const session = {
	token: null
};

if (Cookies.get('NTU_Token')) {
	session.token = Cookies.get('NTU_Token');
}

export default {
	install: function(Vue) {
		Vue.prototype.$backend = {
			logIn(username, password) {
				return api.post('/rest-auth/login/', {
					email: 'test1@scantist.com',
					password: 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f'
				}, {
					params: {
						_now: Date.now()
					}
				}).then(res => {
					session.token = res.data.token;
					Cookies.set('NTU_Token', res.data.token, { expires: 7 });
				});
			},
			logInWithGithub(username, password) {
				return api.post('/rest-auth/github/', {
					access_token: username,
					code: password
				}, {
					params: {
						_now: Date.now()
					}
				}).then(res => {
					console.log(res)
					session.token = res.data.token;
				});
			},
			logOut() {
				api.post('/rest-auth/logout/', Options()).then(transformData);
			},
			issues: {
				getList() {
					return api.get('/issues/', Options()).then(transformData);
				},
				getById(issueId) {
					return api.get(`/issues/${issueId}/`, Options()).then(transformData);
				},
				lastAction: {
					getList(issueId) {
						return api.get(`/issues/${issueId}/last-action/`, Options()).then(transformData);
					}
				},
				hunks: {
					getList(issueId) {
						return api.get(`/issues/${issueId}/hunks/`, Options()).then(transformData);
					},
					getById(issueId, hunkId) {
						return api.get(`/issues/${issueId}/hunks/${hunkId}`, Options()).then(transformData);
					}
				}
			},
			libraries: {
				getList() {
					return api.get('/library-versions/', Options()).then(transformData);
				},
				getById(libraryId) {
					return api.get(`/library-versions/${libraryId}/`, Options()).then(transformData);
				},
				issues: {
					getList(libraryId) {
						return api.get(`/library-versions/${libraryId}/issues/`, Options()).then(transformData);
					},
					getById(libraryId, issueId) {
						return api.get(`/library-versions/${libraryId}/issues/${issueId}`, Options()).then(transformData);
					},
				},
			},
			orgs: {
				create() {
					return api.post('/orgs/', Options()).then(transformData);
				},
				deleteById(orgId) {
					return api.delete(`/orgs/${orgId}`, Options()).then(transformData);
				},
				updateById(orgId) {
					return api.put(`/orgs/${orgId}/`, Options()).then(transformData);
				},
				getList() {
					return api.get('/orgs/', Options()).then(transformData);
				},
				getById(orgId) {
					return api.get(`/orgs/${orgId}/`, Options()).then(transformData);
				},
				members: {
					create(orgId) {
						return api.post(`/orgs/${orgId}/members/`, Options()).then(transformData);
					},
					deleteById(orgId, memberId) {
						return api.delete(`/orgs/${orgId}/members/${memberId}/`, Options()).then(transformData);
					},
					updateById(orgId, memberId) {
						return api.put(`/orgs/${orgId}/members/${memberId}/`, Options()).then(transformData);
					},
					getList(orgId) {
						return api.get(`/orgs/${orgId}/members`, Options()).then(transformData);
					},
					getById(orgId, memberId) {
						return api.get(`/orgs/${orgId}/members/${memberId}/`, Options()).then(transformData);
					}
				},
				teams: {
					create(orgId) {
						return api.post(`/orgs/${orgId}/teams/`, Options()).then(transformData);
					},
					deleteById(orgId, teamId) {
						return api.delete(`/orgs/${orgId}/teams/${teamId}/`, Options()).then(transformData);
					},
					updateById(orgId, teamId) {
						return api.put(`/orgs/${orgId}/teams/${teamId}/`, Options()).then(transformData);
					},
					getList(orgId) {
						return api.get(`/orgs/${orgId}/teams`, Options()).then(transformData);
					},
					getById(orgId, teamId) {
						return api.get(`/orgs/${orgId}/teams/${teamId}/`, Options()).then(transformData);
					}
				},
				binaryUsage: {
					getList(orgId) {
						return api.get(`/orgs/${orgId}/binary-usage/`, Options()).then(transformData);
					},
					getById(orgId, binaryUsageId) {
						return api.get(`/orgs/${orgId}/binary-usage/${binaryUsageId}`, Options()).then(transformData);
					}
				},
				issues: {
					getList(orgId, mode = '') {
						return api.get(`/orgs/${orgId}/issues/${mode}`, Options()).then(transformData);
					},
					getById(orgId, issueId) {
						return api.get(`/orgs/${orgId}/issues/${issueId}/`, Options()).then(transformData);
					}
				},
				knowledgeGraph: {
					getList(orgId) {
						return api.get(`/orgs/${orgId}/knowledge/`, Options()).then(transformData);
					}
				},
				libraries: {
					getList(orgId, mode = '') {
						return api.get(`/orgs/${orgId}/library-versions/${mode}`, Options()).then(transformData);
					},
					getById(orgId, libraryId) {
						return api.get(`/orgs/${orgId}/library-versions/${libraryId}/`, Options()).then(transformData);
					}
				},
				licenses: {
					getList(orgId, mode = '') {
						return api.get(`/orgs/${orgId}/licenses/${mode}`, Options()).then(transformData);
					},
					getById(orgId, licenseId) {
						return api.get(`/orgs/${orgId}/licenses/${licenseId}/`, Options()).then(transformData);
					}
				},
				projects: {
					create(orgId) {
						return api.post(`/orgs/${orgId}/projects/`, Options()).then(transformData);
					},
					deleteById(orgId, projectId) {
						return api.delete(`/orgs/${orgId}/projects/${projectId}/`, Options()).then(transformData);
					},
					updateById(orgId, projectId) {
						return api.put(`/orgs/${orgId}/projects/${projectId}/`, Options()).then(transformData);
					},
					getList(orgId, mode = '') {
						return api.get(`/orgs/${orgId}/projects/${mode}`, Options()).then(transformData);
					},
					getById(orgId, projectId, mode = '') {
						return api.get(`/orgs/${orgId}/projects/${projectId}/${mode}`, Options()).then(transformData);
					}
				},
				scans: {
					getList(orgId, mode = '') {
						return api.get(`/orgs/${orgId}/scans/${mode}`, Options()).then(transformData);
					},
					getById(orgId, scanId, mode = '') {
						return api.get(`/orgs/${orgId}/scans/${scanId}/${mode}`, Options()).then(transformData);
					}
				},
				sourcecodeUsage: {
					getList(orgId) {
						return api.get(`/orgs/${orgId}/sourcecode-usage/`, Options()).then(transformData);
					},
					getById(orgId, sourcecodeUsageId) {
						return api.get(`/orgs/${orgId}/sourcecode-usage/${sourcecodeUsageId}/`, Options()).then(transformData);
					}
				}
			},
			projects: {
				getList() {
					return api.get('/projects/', Options()).then(transformData);
				},
				getById(projectId) {
					return api.get(`/projects/${projectId}/`, Options()).then(transformData);
				},
				scans: {
					create(projectId) {
						return api.post(`/projects/${projectId}/scans/`, Options()).then(transformData);
					},
					deleteById(projectId, scanId) {
						return api.delete(`/projects/${projectId}/scans/${scanId}/`, Options()).then(transformData);
					},
					updateById(projectId, scanId) {
						return api.put(`/projects/${projectId}/scans/${scanId}/`, Options()).then(transformData);
					},
					getList(projectId, mode = '') {
						return api.get(`/projects/${projectId}/scans/${mode}`, Options()).then(transformData);
					},
					getById(projectId, scanId) {
						return api.get(`/projects/${projectId}/scans/${scanId}/`, Options()).then(transformData);
					}
				},
				uploads: {
					create(projectId) {
						return api.post(`/projects/${projectId}/uploads/`, Options()).then(transformData);
					},
					getList(projectId) {
						return api.get(`/projects/${projectId}/uploads/`, Options()).then(transformData);
					},
					getById(projectId, uploadId) {
						return api.get(`/projects/${projectId}/uploads/${uploadId}/`, Options()).then(transformData);
					}
				}
			},
			scans: {
				getList() {
					return api.get('/scans/', Options()).then(transformData);
				},
				getById(scanId) {
					return api.get(`/scans/${scanId}/`, Options()).then(transformData);
				},
				issues: {
					create(scanId, mode = '') {
						return api.post(`/scans/${scanId}/issues/${mode}`, Options()).then(transformData);
					},
					createById(scanId, issueId, mode) {
						return api.post(`/scans/${scanId}/issues/${issueId}/${mode}`, Options()).then(transformData);
					},
					updateById(scanId, issueId, mode) {
						return api.put(`/scans/${scanId}/issues/${issueId}/${mode}`, Options()).then(transformData);
					},
					getList(scanId, mode = '') {
						return api.get(`/scans/${scanId}/issues/${mode}`, Options()).then(transformData);
					},
					getById(scanId, issueId) {
						return api.get(`/scans/${scanId}/issues/${issueId}/`, Options()).then(transformData);
					}
				},
				library: {
					getList(scanId, mode = '') {
						return api.get(`/scans/${scanId}/library-versions/${mode}`, Options()).then(transformData);
					},
					getById(scanId, libraryId) {
						return api.get(`/scans/${scanId}/issues/${libraryId}/`, Options()).then(transformData);
					}
				},
				licenseIssues: {
					getList(scanId, mode = '') {
						return api.get(`/scans/${scanId}/licenseissues/${mode}`, Options()).then(transformData);
					},
					getById(scanId, licenseIssuesId, mode = '') {
						return api.get(`/scans/${scanId}/licenseissues/${licenseIssuesId}/${mode}`, Options()).then(transformData);
					}
				},
				summaries: {
					getList(scanId) {
						return api.get(`/scans/${scanId}/summaries/`, Options()).then(transformData);
					},
					getById(scanId, summaryId) {
						return api.get(`/scans/${scanId}/summaries/${summaryId}/`, Options()).then(transformData);
					}
				}
			},
			teams: {
				getList() {
					return api.get('/teams/', Options()).then(transformData);
				},
				getById(teamId) {
					return api.get(`/teams/${teamId}/`, Options()).then(transformData);
				},
				members: {
					create(teamId) {
						return api.post(`/teams/${teamId}/members/`, Options()).then(transformData);
					},
					deleteById(teamId, memberId) {
						return api.delete(`/teams/${teamId}/members/${memberId}/`, Options()).then(transformData);
					},
					updateById(teamId, memberId) {
						return api.put(`/teams/${teamId}/members/${memberId}/`, Options()).then(transformData);
					},
					getList(teamId) {
						return api.get(`/teams/${teamId}/members/`, Options()).then(transformData);
					},
					getById(teamId, memberId) {
						return api.get(`/teams/${teamId}/members/${memberId}/`, Options()).then(transformData);
					}
				},
				projects: {
					getList(teamId) {
						return api.get(`/teams/${teamId}/projects/`, Options()).then(transformData);
					},
					getById(teamId, projectId) {
						return api.get(`/teams/${teamId}/projects/${projectId}/`, Options()).then(transformData);
					}
				}
			},
			user: {
				getList() {
					return api.get('/user/', Options()).then(transformData);
				},
				orgs: {
					getList() {
						return api.get('/user/orgs/', Options({
							params: {

							}
						})).then(transformData);
					},
					getById(orgId) {
						return api.get(`/user/orgs/${orgId}/`, Options()).then(transformData);
					}
				}
			}
		}
	},
	getOrgId: function() {
		return api.get('/user/orgs/', Options()).then(transformData);
	}
}
