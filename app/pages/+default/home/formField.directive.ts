import {Directive, InputSignal, TemplateRef, ViewContainerRef, effect, inject, input} from '@angular/core';
import {ControlContainer} from '@angular/forms';

@Directive(
    {
        selector: '[formField]',
        standalone: true,
    }
)
export class FormFieldDirective
{
    //######################### private properties #########################

    /**
     * Indication whether is content rendered or not
     */
    private _rendered: boolean = false;

    /**
     * View container
     */
    private _viewContainer: ViewContainerRef = inject(ViewContainerRef);

    /**
     * Template reference
     */
    private _template: TemplateRef<unknown> = inject(TemplateRef<unknown>);

    /**
     * Parent control container
     */
    private _parent = inject(ControlContainer, {
        host: true,
        optional: true,
    });

    //######################### public properties - inputs and outputs #########################

    /**
     * Form field name
     */
    public formField: InputSignal<string> = input.required();

    //######################### constructor #########################

    constructor()
    {
        effect(() =>
        {
            this._renderIfExistsControl(this.formField());
        });
    }

    //######################### private methods #########################

    /**
     * Renders content if form field exists in control container
     */
    private _renderIfExistsControl(formField: string): void
    {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if((<any>this._parent)?.form?.get(formField))
        {
            //already rendered, do nothing
            if(this._rendered)
            {
                return;
            }

            this._viewContainer.clear();
            this._viewContainer.createEmbeddedView(this._template);

            this._rendered = true;
        }
        else
        {
            this._viewContainer.clear();

            this._rendered = false;
        }
    }
}