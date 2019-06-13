import axios from 'axios';
import Cookies from 'js-cookie';
import { sha256 } from 'js-sha256';
import b64toBlob from 'b64-to-blob';

function transformData(res) {
	return res.data;
}

function downloadReport(scanId, filename, reportType) {
	const downloadElement = document.createElement('a');
	const url = `/mock/report/${scanId}/${filename}/${reportType}?token=${Cookies.get('NTU_Token')}`;

	downloadElement.style.display = 'none';
	downloadElement.href = url;
	document.body.appendChild(downloadElement);
	downloadElement.click();

	document.body.removeChild(downloadElement);
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
					email: username,
					// password: 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f',
					password: sha256(password)
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
				create(name, description) {
					return api.post('/orgs/', {
						name: name,
						description: description
					}, Options()).then(transformData);
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
				getByIdMode(orgId, mode) {
					return api.get(`/orgs/${orgId}/${mode}/`, Options()).then(transformData);
				},
				members: {
					create(orgId, email) {
						return api.post(`/orgs/${orgId}/members/`, {
							email: email,
							role: 'member'
						}, Options()).then(transformData);
					},
					deleteById(orgId, memberId) {
						return api.delete(`/orgs/${orgId}/members/${memberId}/`, Options()).then(transformData);
					},
					updateById(orgId, memberId) {
						return api.put(`/orgs/${orgId}/members/${memberId}/`, Options()).then(transformData);
					},
					getList(orgId) {
						return api.get(`/orgs/${orgId}/members/`, Options()).then(transformData);
					},
					getById(orgId, memberId) {
						return api.get(`/orgs/${orgId}/members/${memberId}/`, Options()).then(transformData);
					}
				},
				teams: {
					create(orgId, name, description) {
						return api.post(`/orgs/${orgId}/teams/`, {
							name: name,
							description: description
						}, Options()).then(transformData);
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
					getList(orgId) {
						return api.get(`/orgs/${orgId}/issues/`, Options()).then(transformData);
					},
					getListMode(orgId, mode) {
						return api.get(`/orgs/${orgId}/issues/${mode}/`, Options()).then(transformData);
					},
					getById(orgId, issueId) {
						return api.get(`/orgs/${orgId}/issues/${issueId}/`, Options()).then(transformData);
					}
				},
				knowledgeGraph: {
					getList(orgId) {
						return api.get(`/orgs/${orgId}/knowledge-graph/`, Options()).then(transformData);
					}
				},
				libraries: {
					getList(orgId) {
						return api.get(`/orgs/${orgId}/library-versions/`, Options()).then(transformData);
					},
					getListMode(orgId, mode) {
						return api.get(`/orgs/${orgId}/library-versions/${mode}/`, Options()).then(transformData);
					},
					getById(orgId, libraryId) {
						return api.get(`/orgs/${orgId}/library-versions/${libraryId}/`, Options()).then(transformData);
					}
				},
				licenses: {
					getList(orgId) {
						return api.get(`/orgs/${orgId}/licenses/`, Options()).then(transformData);
					},
					getListMode(orgId, mode) {
						return api.get(`/orgs/${orgId}/licenses/${mode}/`, Options()).then(transformData);
					},
					getById(orgId, licenseId) {
						return api.get(`/orgs/${orgId}/licenses/${licenseId}/`, Options()).then(transformData);
					}
				},
				projects: {
					create(orgId, name, teamId, description, provider) {
						return api.post(`/orgs/${orgId}/projects/`, {
							name: name,
							description: description || '',
							team: teamId,
							provider: provider
						}, Options()).then(transformData);
					},
					deleteById(orgId, projectId) {
						return api.delete(`/orgs/${orgId}/projects/${projectId}/`, Options()).then(transformData);
					},
					updateById(orgId, projectId) {
						return api.patch(`/orgs/${orgId}/projects/${projectId}/`, {
							archived: false
						}, Options()).then(transformData);
					},
					getList(orgId) {
						return api.get(`/orgs/${orgId}/projects/`, Options()).then(transformData);
					},
					getListMode(orgId, mode) {
						return api.get(`/orgs/${orgId}/projects/${mode}/`, Options()).then(transformData);
					},
					getById(orgId, projectId) {
						return api.get(`/orgs/${orgId}/projects/${projectId}/`, Options()).then(transformData);
					},
					getByIdMode(orgId, projectId, mode) {
						return api.get(`/orgs/${orgId}/projects/${projectId}/${mode}/`, Options()).then(transformData);
					},
				},
				scans: {
					getList(orgId) {
						return api.get(`/orgs/${orgId}/scans/`, Options()).then(transformData);
					},
					getListMode(orgId, mode) {
						return api.get(`/orgs/${orgId}/scans/${mode}/`, Options()).then(transformData);
					},
					getById(orgId, scanId) {
						return api.get(`/orgs/${orgId}/scans/${scanId}/`, Options()).then(transformData);
					},
					getByIdMode({orgId, scanId, mode, limit, page, search, issueType, ordering, scan1, scan2, scan3, scan4}) {
						return api.get(`/orgs/${orgId}/scans/${scanId}/${mode}/`, Options({
							params: {
								// limit: limit || '',
								// page: page || '',
								search: search || '',
								issue_type: issueType || '',
								ordering: ordering || '',
								scan1: scan1 || -1,
								scan2: scan2 || -1,
								scan3: scan3 || -1,
								scan4: scan4 || -1,
							}
						})).then(transformData);
					}
				},
				sourcecodeUsage: {
					getList(orgId) {
						return api.get(`/orgs/${orgId}/sourcecode-usage/`, Options()).then(transformData);
					},
					getById(orgId, sourcecodeUsageId) {
						return api.get(`/orgs/${orgId}/sourcecode-usage/${sourcecodeUsageId}/`, Options()).then(transformData);
					}
				},
				licensePolicies: {
					create(orgId, name, description) {
						return api.post(`/orgs/${orgId}/license-policies/`, {
							name: name,
							description: description
						}, Options()).then(transformData);
					},
					createRules(orgId, policyId, ruleType, itemId, action, attributeCategory = '') {
						return api.post(`/orgs/${orgId}/license-policies/${policyId}/license-policy-rules/`, {
							action: action,
							activeOrgId: orgId,
							item_id: itemId,
							licensePolicyCode: policyId,
							rule_type: ruleType,
							attribute_category: attributeCategory
						}, Options()).then(transformData);
					},
					deleteRules(orgId, policyCode, ruleId) {
						return api.delete(`/orgs/${orgId}/license-policies/${policyCode}/license-policy-rules/${ruleId}/`, Options()).then(transformData);
					},
					delete(orgId, policyCode) {
						return api.delete(`/orgs/${orgId}/license-policies/${policyCode}/`, Options()).then(transformData);
					},
					getByIdMode(orgId, policyCode, mode) {
						return api.get(`/orgs/${orgId}/license-policies/${policyCode}/${mode}/`, Options()).then(transformData);
					},
					getById(orgId, policyCode) {
						return api.get(`/orgs/${orgId}/license-policies/${policyCode}/`, Options()).then(transformData);
					},
				},
				tokens: {
					create(orgId, name) {
						return api.post(`/orgs/${orgId}/integration-tokens/`, {
							name: name
						}, Options()).then(transformData);
					},
					delete(orgId, tokemId) {
						return api.delete(`/orgs/${orgId}/integration-tokens/${tokemId}/`, Options()).then(transformData);
					},
					getList(orgId) {
						return api.get(`/orgs/${orgId}/integration-tokens/`, Options()).then(transformData);
					},
				}
			},
			projects: {
				getList() {
					return api.get('/projects/', Options()).then(transformData);
				},
				getById(projectId) {
					return api.get(`/projects/${projectId}/`, Options()).then(transformData);
				},
				getByIdMode(projectId, mode) {
					return api.get(`/projects/${projectId}/${mode}/`, Options()).then(transformData);
				},
				scans: {
					create(projectId, scanType) {
						return api.post(`/projects/${projectId}/scans/`, {
							scan_type: scanType
						}, Options({
							params: {
								branch: 'master'
							}
						})).then(transformData);
					},
					deleteById(projectId, scanId) {
						return api.delete(`/projects/${projectId}/scans/${scanId}/`, Options()).then(transformData);
					},
					updateById(projectId, scanId) {
						return api.put(`/projects/${projectId}/scans/${scanId}/`, Options()).then(transformData);
					},
					getList(projectId) {
						return api.get(`/projects/${projectId}/scans/`, Options()).then(transformData);
					},
					getListMode(projectId, mode) {
						return api.get(`/projects/${projectId}/scans/${mode}/`, Options()).then(transformData);
					},
					getById(projectId, scanId) {
						return api.get(`/projects/${projectId}/scans/${scanId}/`, Options()).then(transformData);
					}
				},
				uploads: {
					create(projectId, downloadLink, fileModified, fileSize, fileName) {
						return api.post(`/projects/${projectId}/uploads/`, {
							download_link: downloadLink,
							file_modified: fileModified,
							file_size: fileSize,
							filename: fileName
						}, Options()).then(transformData);
					},
					getList(projectId) {
						return api.get(`/projects/${projectId}/uploads/`, Options()).then(transformData);
					},
					getById(projectId, uploadId) {
						return api.get(`/projects/${projectId}/uploads/${uploadId}/`, Options()).then(transformData);
					}
				},
				upload: {
					create(projectId) {
						return api.post(`/projects/${projectId}/upload/`, {}, Options()).then(transformData);
					}
				},
				scanPolicies: {
					updateById(projectId, scanPolicyId, inUse, policyCode) {
						return api.patch(`/projects/${projectId}/scan-policies/${scanPolicyId}/`, {
							in_use: inUse,
							policy_code: policyCode
						}, Options()).then(transformData);
					},
				},
				licensePolicies: {
					updateById(projectId, policyCode) {
						return api.patch(`/projects/${projectId}/license-policies/${projectId}/`, {
							license_policy: policyCode
						}, Options()).then(transformData);
					},
				},
			},
			scans: {
				getList() {
					return api.get('/scans/', Options()).then(transformData);
				},
				getById(scanId) {
					return api.get(`/scans/${scanId}/`, Options()).then(transformData);
				},
				getByIdMode(scanId, mode) {
					return api.get(`/scans/${scanId}/${mode}/`, Options()).then(transformData);
				},
				issues: {
					create(scanId) {
						return api.post(`/scans/${scanId}/issues/`, {}, Options()).then(transformData);
					},
					createMode(scanId, mode) {
						return api.post(`/scans/${scanId}/issues/${mode}/`, {}, Options()).then(transformData);
					},
					createById(scanId, issueId) {
						return api.post(`/scans/${scanId}/issues/${issueId}/`, {}, Options()).then(transformData);
					},
					createByIdMode(scanId, issueId, mode) {
						return api.post(`/scans/${scanId}/issues/${issueId}/${mode}/`, Options()).then(transformData);
					},
					updateById(scanId, issueId) {
						return api.patch(`/scans/${scanId}/issues/${issueId}/`, {}, Options()).then(transformData);
					},
					updateByIdMode(scanId, issueId, mode) {
						return api.patch(`/scans/${scanId}/issues/${issueId}/${mode}/`, {}, Options()).then(transformData);
					},
					getList(scanId) {
						return api.get(`/scans/${scanId}/issues/`, Options()).then(transformData);
					},
					getListMode(scanId, mode) {
						return api.get(`/scans/${scanId}/issues/${mode}/`, Options()).then(transformData);
					},
					getById(scanId, issueId) {
						return api.get(`/scans/${scanId}/issues/${issueId}/`, Options()).then(transformData);
					}
				},
				libraries: {
					getList(scanId) {
						return api.get(`/scans/${scanId}/library-versions/`, Options()).then(transformData);
					},
					getListMode(scanId, mode) {
						return api.get(`/scans/${scanId}/library-versions/${mode}/`, Options()).then(transformData);
					},
					getById(scanId, libraryId) {
						return api.get(`/scans/${scanId}/issues/${libraryId}/`, Options()).then(transformData);
					}
				},
				licenseIssues: {
					getList(scanId) {
						return api.get(`/scans/${scanId}/licenseissues/`, Options()).then(transformData);
					},
					getListMode(scanId, mode) {
						return api.get(`/scans/${scanId}/licenseissues/${mode}/`, Options()).then(transformData);
					},
					getById(scanId, licenseIssuesId) {
						return api.get(`/scans/${scanId}/licenseissues/${licenseIssuesId}/`, Options()).then(transformData);
					},
					getByIdMode(scanId, licenseIssuesId, mode) {
						return api.get(`/scans/${scanId}/licenseissues/${licenseIssuesId}/${mode}/`, Options()).then(transformData);
					},
				},
				summaries: {
					getList(scanId) {
						return api.get(`/scans/${scanId}/summaries/`, Options()).then(transformData);
					},
					getById(scanId, summaryId) {
						return api.get(`/scans/${scanId}/summaries/${summaryId}/`, Options()).then(transformData);
					}
				},
				actions: {
					create(scanId, issueId, issueType, priority, actionType, assignee, comment) {
						return api.post(`/scans/${scanId}/actions/`, {
							scanID: scanId,
							issue_id: issueId,
							issue_type: issueType,
							priority: priority,
							action_type: actionType,
							assignee: assignee,
							comment: comment
						}, Options()).then(transformData);
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
				getConfig() {
					return api.get('/noti-config/', Options()).then(transformData);
				},
				updateConfigById(id, status) {
					return api.patch(`/noti-config/${id}/`, {
						enabled: status
					}, Options()).then(transformData);
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
			},
			restAuth: {
				password: {
					change(oldPassword, newPassword1, newPassword2) {
						return api.post('/rest-auth/password/change/', {
							old_password: sha256(oldPassword),
							new_password1: sha256(newPassword1),
							new_password2: sha256(newPassword2),
						}, Options()).then(transformData);
					}
				},
				registration: {
					create(username, email, newPassword1, newPassword2) {
						return api.post('/rest-auth/registration/', {
							username: username,
							email: email,
							password1: sha256(newPassword1),
							password2: sha256(newPassword2),
						}, Options()).then(transformData);
					}
				}
			},
			export: {
				licenseIssues: {
					download(scanId) {
						downloadReport(scanId, `scan_${scanId}_license.pdf`, 'licenseissues');
					},
					export(scanId) {
						return api.get(`/scans/${scanId}/licenseissues/export/`, Options({
							params: {
								language: 'chinese',
								report_format: 'pdf'
							},
						})).then(transformData);
					},
				},
				libraries: {
					download(scanId) {
						downloadReport(scanId, `scan_${scanId}_library.pdf`, 'library-versions');
					},
					export(scanId) {
						return api.get(`/scans/${scanId}/library-versions/export/`, Options({
							params: {
								language: 'chinese',
								report_format: 'pdf'
							},
						})).then(transformData);
					},
				},
				issues: {
					download(scanId) {
						downloadReport(scanId, `scan_${scanId}_library.pdf`, 'issues');						
					},
					export(scanId) {
						return api.get(`/scans/${scanId}/issues/export/`, Options({
							params: {
								language: 'chinese',
								report_format: 'pdf'
							},
						})).then(transformData);
					},
				},

			},
			upload: {
				create(formData) {
					return api.post('/upload/', formData, Options()).then(transformData);
				},
			},
			licenses: {
				getList() {
					return api.get('/licenses/', Options()).then(transformData);
				},
				attributes: {
					getList() {
						return api.get('/license-attributes/', Options()).then(transformData);
					},
				}
			},
		}
	},
	getOrgId: function() {
		return api.get('/user/orgs/', Options()).then(transformData);
	}
}
