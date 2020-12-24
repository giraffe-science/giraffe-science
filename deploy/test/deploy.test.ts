import {expect as expectCDK, MatchStyle, matchTemplate} from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import {ApiStack} from "../lib/api-stack";

test('Empty Stack', () => {
    const app = new cdk.App();
    const stack = new ApiStack(app, 'MyTestStack');
    expectCDK(stack).to(matchTemplate({
        "Resources": {}
    }, MatchStyle.EXACT))
});
