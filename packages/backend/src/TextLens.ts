import {HttpMessage} from "@http4t/core/contract";
import {header} from "@http4t/core/headers";
import {bufferText} from "@http4t/core/bodies";
import {success} from "@http4t/result";
import {MessageLens, routeFailed, RoutingResult} from "@http4t/bidi/lenses";

/**
 * NB: does not _check_ `Content-Type` header when extracting, but does
 * _set_ it when injecting
 *
 */
export class TextLens<TMessage extends HttpMessage> implements MessageLens<TMessage, string> {
    async get(message: TMessage): Promise<RoutingResult<string>> {
        try {
            const value = await bufferText(message.body);
            return success(value);
        } catch (e) {
            return routeFailed(`Failed to get body as text${e.message ? `- "${e.message}"` : ""}`, ["body"])
        }
    }

    async set(into: TMessage, value: string): Promise<TMessage> {
        return {
            ...into,
            headers: [...into.headers, header('Content-Type', 'text/plain')],
            body: value
        };
    }
}

export function text<TMessage extends HttpMessage = HttpMessage>(): TextLens<TMessage> {
    return new TextLens<TMessage>();
}
