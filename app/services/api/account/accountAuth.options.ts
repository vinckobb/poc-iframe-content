import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AccessToken, AuthenticationServiceOptions, UserIdentity} from '@anglr/authentication';
import {Dictionary} from '@jscrpt/common';
import {EMPTY, NEVER, Observable} from 'rxjs';
import Keycloak from 'keycloak-js';

import permissions from '../../../../config/permissions.json';

/**
 * Class represents authentication service options for account
 */
@Injectable()
export class AccountAuthOptions extends AuthenticationServiceOptions
{
    //######################### private fields #########################

    /**
     * Computed permissions for roles
     */
    private _permissions: Dictionary<string[]>|undefined|null;

    //######################### private properties #########################

    /**
     * Gets computed permissions for roles
     */
    private get permissions(): Dictionary<string[]>
    {
        return this._permissions ??= this._computePermissionsForRoles();
    }

    //######################### constructor #########################
    constructor(private _router: Router,
                private _keycloak: Keycloak)
    {
        super();
    }

    //######################### public methods - implementation of AuthenticationServiceOptions #########################

    /**
     * @inheritdoc
     */
    public login(_accessToken: AccessToken): Observable<void>
    {
        return EMPTY;
    }

    /**
     * @inheritdoc
     */
    public isAuthPage(_path?: string): boolean
    {
        return false;
    }

    /**
     * @inheritdoc
     */
    public logout(): Observable<void>
    {
        this._keycloak
            .logout()
            .then(() =>
            {
                this._keycloak.clearToken();
                window.location.href = '/';
            })
            .catch(() =>
            {
                this._keycloak.clearToken();
                // window.location.reload();
                window.location.href = '/';
            });

        return NEVER;
    }

    /**
     * @inheritdoc
     */
    public getUserIdentity(): Observable<UserIdentity>
    {
        return new Observable(subscriber =>
        {
            (async () =>
            {
                //authenticated
                if(this._keycloak.authenticated)
                {
                    const profile = await this._keycloak.loadUserProfile();
                    const roles = this._keycloak.realmAccess?.roles ?? [];

                    if(profile.username == 'developer')
                    {
                        roles.push('DEVELOPER');
                    }

                    const privileges = this._roles2privileges(roles);
                    // const token: string = await this._keycloakSvc.getToken();
                    // const tokenPayload = this._getTokenPayload(token);

                    subscriber.next(
                    {
                        isAuthenticated: true,
                        userName: profile.username ?? '',
                        firstName: profile.firstName ?? '',
                        surname: profile.lastName ?? '',
                        permissions: privileges.concat(['authenticated']),
                        //additionalInfo: { omType: tokenPayload.omType },
                        additionalInfo: null,
                    });

                    subscriber.complete();
                }
                else
                {
                    subscriber.next(
                    {
                        isAuthenticated: false,
                        userName: '',
                        permissions: [],
                        firstName: '',
                        surname: '',
                        additionalInfo: null,
                    });

                    subscriber.complete();
                }
            })();
        });
    }

    /**
     * @inheritdoc
     */
    public showAuthPage(): Promise<boolean>
    {
        return this._keycloak.login() as any;
    }

    /**
     * @inheritdoc
     */
    public showAccessDenied(): Promise<boolean>
    {
        return this._router.navigate(['/accessDenied']);
    }

    /**
     * Gets array of permissions for provided roles
     * @param roles Array of roles to be transformed to permissions
     */
    private _roles2privileges(roles: string[]): string[]
    {
        const perms: {[permission: string]: boolean} = {};

        (roles ?? []).forEach(role => (this.permissions[role] ?? []).forEach(permission => perms[permission] = true));

        return Object.keys(perms);
    }

    /**
     * Computes permissions for roles
     */
    private _computePermissionsForRoles(): Dictionary<string[]>
    {
        const computedPermissions: Dictionary<string[]> = {};

        Object.keys(permissions).forEach(permission =>
        {
            const roles = (permissions as Dictionary)[permission];

            if(Array.isArray(roles))
            {
                roles.forEach(role =>
                {
                    computedPermissions[role] ??= [];
                    computedPermissions[role].push(permission);
                });
            }
        });

        return computedPermissions;
    }
}
