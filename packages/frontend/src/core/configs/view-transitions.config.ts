import { ViewTransitionInfo } from '@angular/router';

export const onViewTransitionCreated = (info: ViewTransitionInfo): void => {
  const fromFragment = info.from.fragment ?? null;
  const toFragment = info.to.fragment ?? null;

  const fromRoute = info.from.firstChild?.routeConfig?.path;
  const toRoute = info.to.firstChild?.routeConfig?.path;

  const fromRouteBaseSegment = fromRoute?.split('/')[0] ?? null;
  const toRouteBaseSegment = toRoute?.split('/')[0] ?? null;

  const isSameRoute = fromRoute === toRoute;
  const isOnlyAnchorChange = isSameRoute && fromFragment !== toFragment;
  const isInsideQuiz = fromRouteBaseSegment === 'quiz' && toRouteBaseSegment === 'quiz';
  const isInsideChallenges =
    fromRouteBaseSegment === 'challenges' && toRouteBaseSegment === 'challenges';

  if (isOnlyAnchorChange || isInsideQuiz || isInsideChallenges) {
    info.transition.skipTransition();
  }
};
