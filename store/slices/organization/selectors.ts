import type { ReduxState } from '../../index';
import type { IOrganization } from '../../../utils/types';

export const selectOrganization = (state: ReduxState): IOrganization => state.organization;
export const selectOrganizationName = (state: ReduxState) => state.organization.organizationName;
